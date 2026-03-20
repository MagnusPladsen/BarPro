"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database, BookingStatus } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchBookings = useCallback(async () => {
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setBookings((data as Booking[]) ?? []);
  }, [supabase, filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdating(true);
    await supabase.from("bookings").update({ status }).eq("id", id);
    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
    await fetchBookings();
    setUpdating(false);
  };

  const saveNotes = async (id: string) => {
    setUpdating(true);
    await supabase.from("bookings").update({ admin_notes: adminNotes }).eq("id", id);
    await fetchBookings();
    setUpdating(false);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("no-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const packageLabels: Record<string, string> = {
    basis: "Basis",
    premium: "Premium",
    eksklusiv: "Eksklusiv",
  };

  const eventLabels: Record<string, string> = {
    wedding: "Bryllup",
    corporate: "Bedriftsarrangement",
    private: "Privat feiring",
    other: "Annet",
  };

  const statusLabels: Record<string, string> = {
    pending: "Ventende",
    confirmed: "Bekreftet",
    cancelled: "Avlyst",
    completed: "Fullført",
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    confirmed: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    completed: "text-[#6B6B6B] bg-[#6B6B6B]/10",
  };

  const filters: { value: BookingStatus | "all"; label: string }[] = [
    { value: "all", label: "Alle" },
    { value: "pending", label: "Ventende" },
    { value: "confirmed", label: "Bekreftet" },
    { value: "completed", label: "Fullført" },
    { value: "cancelled", label: "Avlyst" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Bookinger</h1>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30"
                : "text-[#6B6B6B] border border-[#1E1E1E] hover:text-[#F5F0E8]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className={`${selected ? "w-1/2" : "w-full"} space-y-2 transition-all`}>
          {bookings.length === 0 ? (
            <div className="bg-[#141414] border border-[#1E1E1E] p-10 text-center text-[#6B6B6B] text-sm">
              Ingen bookinger funnet
            </div>
          ) : (
            bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelected(b);
                  setAdminNotes(b.admin_notes ?? "");
                }}
                className={`w-full text-left bg-[#141414] border p-4 transition-colors cursor-pointer ${
                  selected?.id === b.id
                    ? "border-[#C9A84C]/40"
                    : "border-[#1E1E1E] hover:border-[#C9A84C]/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{b.customer_name}</p>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] mt-1">
                  {formatDate(b.date)} · {packageLabels[b.package]} · {b.guest_count} gjester
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-1/2 bg-[#141414] border border-[#1E1E1E] p-6 sticky top-8 self-start">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">{selected.customer_name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Dato</p>
                  <p>{formatDate(selected.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Pakke</p>
                  <p>{packageLabels[selected.package]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Type</p>
                  <p>{eventLabels[selected.event_type]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Gjester</p>
                  <p>{selected.guest_count}</p>
                </div>
              </div>

              <div className="border-t border-[#1E1E1E] pt-4">
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">E-post</p>
                <a href={`mailto:${selected.customer_email}`} className="text-[#C9A84C] hover:underline">
                  {selected.customer_email}
                </a>
              </div>

              {selected.customer_phone && (
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Telefon</p>
                  <a href={`tel:${selected.customer_phone}`} className="text-[#C9A84C] hover:underline">
                    {selected.customer_phone}
                  </a>
                </div>
              )}

              {selected.wants_callback && (
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-2 text-[11px] text-[#C9A84C]">
                  Kunden ønsker å bli ringt opp
                </div>
              )}

              {selected.message && (
                <div>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Melding</p>
                  <p className="text-[#6B6B6B]">{selected.message}</p>
                </div>
              )}

              {/* Admin notes */}
              <div className="border-t border-[#1E1E1E] pt-4">
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2">Admin-notater</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]/40 transition-colors resize-none"
                  placeholder="Interne notater..."
                />
                <button
                  onClick={() => saveNotes(selected.id)}
                  disabled={updating}
                  className="mt-2 text-[11px] text-[#C9A84C] hover:underline cursor-pointer disabled:opacity-50"
                >
                  Lagre notater
                </button>
              </div>

              {/* Status actions */}
              <div className="border-t border-[#1E1E1E] pt-4 flex gap-2">
                {selected.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, "confirmed")}
                      disabled={updating}
                      className="flex-1 bg-green-400/10 text-green-400 border border-green-400/30 py-2 text-xs uppercase tracking-wider hover:bg-green-400/20 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Bekreft
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, "cancelled")}
                      disabled={updating}
                      className="flex-1 bg-red-400/10 text-red-400 border border-red-400/30 py-2 text-xs uppercase tracking-wider hover:bg-red-400/20 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Avslå
                    </button>
                  </>
                )}
                {selected.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(selected.id, "completed")}
                    disabled={updating}
                    className="flex-1 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Marker som fullført
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
