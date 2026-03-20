"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { CalendarGridSkeleton } from "@/components/ui/LoadingState";
import { ButtonSpinner } from "@/components/ui/Skeleton";

type BlockedDate = Database["public"]["Tables"]["blocked_dates"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"] & {
  employees?: { name: string; role: string } | null;
};

interface DayModal {
  dateStr: string;
  day: number;
  blocked: BlockedDate | null;
  booking: Booking | null;
  assignments: Assignment[];
}

export default function AdminCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [modal, setModal] = useState<DayModal | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1).toISOString().split("T")[0];
    const end = new Date(year, month + 1, 0).toISOString().split("T")[0];

    try {
      const res = await fetch(`/api/admin/calendar?start=${start}&end=${end}`);
      const data = await res.json();
      setBlockedDates((data.blockedDates as BlockedDate[]) ?? []);
      setBookings((data.bookings as Booking[]) ?? []);
      setAllAssignments((data.assignments as Assignment[]) ?? []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch calendar data:", err);
    }
  }, [currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openDayModal = (day: number) => {
    const dateStr = getDateStr(day);
    const blocked = blockedDates.find((d) => d.date === dateStr) ?? null;
    const booking = bookings.find((b) => b.date === dateStr) ?? null;
    const assignments = booking
      ? allAssignments.filter((a) => a.booking_id === booking.id)
      : [];

    setBlockReason(blocked?.reason ?? "");
    setModal({ dateStr, day, blocked, booking, assignments });
  };

  const blockDate = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: modal.dateStr, reason: blockReason || null }),
      });
      await fetchData();
      // Update modal with new blocked state
      const updated = blockedDates.find((d) => d.date === modal.dateStr);
      setModal({ ...modal, blocked: updated ?? { id: "new", date: modal.dateStr, reason: blockReason, created_at: "" } });
    } catch (err) {
      console.error("Failed to block date:", err);
    }
    setSaving(false);
  };

  const unblockDate = async () => {
    if (!modal?.blocked) return;
    setSaving(true);
    try {
      await fetch("/api/admin/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modal.blocked.id }),
      });
      await fetchData();
      setModal({ ...modal, blocked: null });
      setBlockReason("");
    } catch (err) {
      console.error("Failed to unblock date:", err);
    }
    setSaving(false);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const today = new Date().toISOString().split("T")[0];

  const days: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getDateStr = (day: number): string =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const monthNames = ["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"];
  const dayNames = ["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"];
  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
  const eventLabels: Record<string, string> = { wedding: "Bryllup", corporate: "Bedrift", private: "Privat", other: "Annet" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <p className="text-[11px] text-[#6B6B6B] tracking-wider">Klikk på en dag for detaljer</p>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer px-3 py-1">&larr;</button>
        <h2 className="text-lg font-medium">{monthNames[month]} {year}</h2>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer px-3 py-1">&rarr;</button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-[11px] text-[#6B6B6B]">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-transparent border border-[#1E1E1E]" /> Ledig</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400/20 border border-red-400/40" /> Blokkert</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400/20 border border-yellow-400/40" /> Ventende</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400/20 border border-green-400/40" /> Bekreftet</div>
      </div>

      {/* Calendar */}
      {loading ? (
        <CalendarGridSkeleton />
      ) : (
      <div className="bg-[#141414] border border-[#1E1E1E]">
        <div className="grid grid-cols-7 border-b border-[#1E1E1E]">
          {["Man","Tir","Ons","Tor","Fre","Lør","Søn"].map((d) => (
            <div key={d} className="p-3 text-center text-[11px] tracking-wider uppercase text-[#6B6B6B]">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="p-3 min-h-[80px] border-b border-r border-[#1E1E1E]" />;

            const dateStr = getDateStr(day);
            const isPast = dateStr < today;
            const blocked = blockedDates.some((d) => d.date === dateStr);
            const booking = bookings.find((b) => b.date === dateStr);
            const isBooked = !!booking;

            let bgClass = "bg-transparent";
            if (blocked) bgClass = "bg-red-400/10";
            else if (isBooked && booking.status === "confirmed") bgClass = "bg-green-400/10";
            else if (isBooked && booking.status === "pending") bgClass = "bg-yellow-400/10";
            else if (isBooked && booking.status === "completed") bgClass = "bg-[#6B6B6B]/10";

            const staffCount = isBooked ? allAssignments.filter((a) => a.booking_id === booking.id).length : 0;

            return (
              <button key={day} onClick={() => openDayModal(day)}
                className={`p-3 min-h-[80px] border-b border-r border-[#1E1E1E] text-left transition-colors duration-200 cursor-pointer hover:bg-[#1A1A1A] ${bgClass} ${isPast ? "opacity-40" : ""}`}>
                <span className={`text-sm ${dateStr === today ? "text-[#C9A84C] font-semibold" : ""}`}>{day}</span>
                {blocked && !isBooked && <p className="text-[9px] text-red-400 mt-1">Blokkert</p>}
                {isBooked && (
                  <div className="mt-1">
                    <p className={`text-[10px] truncate ${booking.status === "pending" ? "text-yellow-400" : booking.status === "confirmed" ? "text-green-400" : "text-[#6B6B6B]"}`}>
                      {booking.customer_name}
                    </p>
                    <p className="text-[9px] text-[#6B6B6B]">{packageLabels[booking.package]} · {staffCount} pers</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Day modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-[#141414] border border-[#1E1E1E] w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1E1E1E]">
              <div>
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">
                  {dayNames[new Date(modal.dateStr + "T00:00:00").getDay()]}
                </p>
                <h3 className="text-lg font-medium">
                  {modal.day}. {monthNames[month]} {year}
                </h3>
              </div>
              <button onClick={() => setModal(null)} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer text-xl">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking info */}
              {modal.booking ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Booking</p>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${
                      modal.booking.status === "pending" ? "text-yellow-400 bg-yellow-400/10" :
                      modal.booking.status === "confirmed" ? "text-green-400 bg-green-400/10" :
                      "text-[#6B6B6B] bg-[#6B6B6B]/10"
                    }`}>
                      {modal.booking.status === "pending" ? "Ventende" : modal.booking.status === "confirmed" ? "Bekreftet" : "Fullført"}
                    </span>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{modal.booking.customer_name}</p>
                      <p className="text-[11px] text-[#C9A84C]">{packageLabels[modal.booking.package]}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[#6B6B6B]">Type: </span>
                        <span>{eventLabels[modal.booking.event_type]}</span>
                      </div>
                      <div>
                        <span className="text-[#6B6B6B]">Gjester: </span>
                        <span>{modal.booking.guest_count}</span>
                      </div>
                      {modal.booking.start_time && (
                        <div>
                          <span className="text-[#6B6B6B]">Tid: </span>
                          <span>{modal.booking.start_time} – {modal.booking.end_time}</span>
                        </div>
                      )}
                      {modal.booking.estimated_hours && (
                        <div>
                          <span className="text-[#6B6B6B]">Timer: </span>
                          <span>{modal.booking.estimated_hours} t</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assigned staff */}
                  {modal.assignments.length > 0 && (
                    <div>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2">Ansatte ({modal.assignments.length})</p>
                      <div className="space-y-1">
                        {modal.assignments.map((a) => (
                          <div key={a.id} className="flex items-center justify-between py-1.5 px-2 bg-[#0A0A0A] border border-[#1E1E1E] text-sm">
                            <span>{a.employees?.name ?? "Ukjent"}</span>
                            <span className="text-[10px] text-[#6B6B6B]">{a.employees?.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={`/admin/bookinger?id=${modal.booking.id}`} onClick={() => setModal(null)}
                    className="block w-full text-center bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 transition-colors">
                    Åpne booking &rarr;
                  </Link>
                </div>
              ) : (
                <p className="text-[#6B6B6B] text-sm">Ingen booking på denne dagen.</p>
              )}

              {/* Block/unblock */}
              <div className="border-t border-[#1E1E1E] pt-6">
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-3">Tilgjengelighet</p>

                {modal.blocked ? (
                  <div className="space-y-3">
                    <div className="bg-red-400/10 border border-red-400/20 p-3">
                      <p className="text-sm text-red-400">Denne dagen er blokkert</p>
                      {modal.blocked.reason && (
                        <p className="text-[11px] text-[#6B6B6B] mt-1">{modal.blocked.reason}</p>
                      )}
                    </div>
                    <button onClick={unblockDate} disabled={saving}
                      className="w-full border border-[#1E1E1E] py-2 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] transition-colors cursor-pointer disabled:opacity-50">
                      Fjern blokkering
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input value={blockReason} onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Grunn (valgfritt, f.eks. 'Ferie', 'Opptatt')"
                      className="w-full bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
                    <button onClick={blockDate} disabled={saving}
                      className="w-full bg-red-400/10 text-red-400 border border-red-400/30 py-2 text-xs uppercase tracking-wider hover:bg-red-400/20 transition-colors cursor-pointer disabled:opacity-50">
                      {saving ? <span className="flex items-center justify-center gap-1.5"><ButtonSpinner />Lagrer...</span> : "Blokker denne dagen"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
