"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database } from "@/lib/supabase/types";

type BlockedDate = Database["public"]["Tables"]["blocked_dates"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export default function AdminCalendarPage() {
  const supabase = createClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1).toISOString().split("T")[0];
    const end = new Date(year, month + 1, 0).toISOString().split("T")[0];

    const [blockedRes, bookingsRes] = await Promise.all([
      supabase
        .from("blocked_dates")
        .select("*")
        .gte("date", start)
        .lte("date", end),
      supabase
        .from("bookings")
        .select("*")
        .gte("date", start)
        .lte("date", end)
        .in("status", ["pending", "confirmed"]),
    ]);

    setBlockedDates((blockedRes.data as BlockedDate[]) ?? []);
    setBookings((bookingsRes.data as Booking[]) ?? []);
  }, [supabase, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleBlocked = async (dateStr: string) => {
    setLoading(true);
    const existing = blockedDates.find((d) => d.date === dateStr);

    if (existing) {
      await supabase.from("blocked_dates").delete().eq("id", existing.id);
    } else {
      await supabase.from("blocked_dates").insert({ date: dateStr });
    }

    await fetchData();
    setLoading(false);
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

  const getDateStr = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isBlocked = (day: number): boolean => {
    return blockedDates.some((d) => d.date === getDateStr(day));
  };

  const getBooking = (day: number): Booking | undefined => {
    return bookings.find((b) => b.date === getDateStr(day));
  };

  const monthNames = [
    "Januar", "Februar", "Mars", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Desember",
  ];

  const packageLabels: Record<string, string> = {
    basis: "Basis",
    premium: "Premium",
    eksklusiv: "Eksklusiv",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <p className="text-[11px] text-[#6B6B6B] tracking-wider">
          Klikk for å blokkere/åpne dager
        </p>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer px-3 py-1"
        >
          &larr;
        </button>
        <h2 className="text-lg font-medium">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer px-3 py-1"
        >
          &rarr;
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-[11px] text-[#6B6B6B]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-transparent border border-[#1E1E1E]" /> Ledig
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400/20 border border-red-400/40" /> Blokkert
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400/20 border border-yellow-400/40" /> Ventende
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400/20 border border-green-400/40" /> Bekreftet
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-[#141414] border border-[#1E1E1E]">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#1E1E1E]">
          {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
            <div key={day} className="p-3 text-center text-[11px] tracking-wider uppercase text-[#6B6B6B]">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="p-3 min-h-[80px] border-b border-r border-[#1E1E1E]" />;
            }

            const dateStr = getDateStr(day);
            const isPast = dateStr < today;
            const blocked = isBlocked(day);
            const booking = getBooking(day);
            const isBooked = !!booking;

            let bgClass = "bg-transparent";
            if (blocked) {
              bgClass = "bg-red-400/10";
            } else if (isBooked && booking.status === "confirmed") {
              bgClass = "bg-green-400/10";
            } else if (isBooked && booking.status === "pending") {
              bgClass = "bg-yellow-400/10";
            }

            return (
              <button
                key={day}
                onClick={() => !isPast && !isBooked && toggleBlocked(dateStr)}
                disabled={isPast || loading}
                className={`p-3 min-h-[80px] border-b border-r border-[#1E1E1E] text-left transition-colors duration-200 ${bgClass} ${
                  isPast
                    ? "opacity-30 cursor-not-allowed"
                    : isBooked
                      ? "cursor-default"
                      : "cursor-pointer hover:bg-[#1A1A1A]"
                }`}
              >
                <span className={`text-sm ${dateStr === today ? "text-[#C9A84C] font-semibold" : ""}`}>
                  {day}
                </span>
                {blocked && !isBooked && (
                  <div className="mt-1">
                    <span className="text-[10px] text-red-400">Blokkert</span>
                  </div>
                )}
                {isBooked && (
                  <div className="mt-1">
                    <p className={`text-[10px] truncate ${booking.status === "pending" ? "text-yellow-400" : "text-green-400"}`}>
                      {booking.customer_name}
                    </p>
                    <p className="text-[9px] text-[#6B6B6B]">{packageLabels[booking.package]}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
