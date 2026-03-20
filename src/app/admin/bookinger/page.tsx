"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database, BookingStatus } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"];
type Cost = Database["public"]["Tables"]["booking_costs"]["Row"];
type Offer = Database["public"]["Tables"]["offers"]["Row"];
type Agreement = Database["public"]["Tables"]["agreements"]["Row"];
type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [tab, setTab] = useState<"details" | "chat" | "offer" | "agreement">("details");

  // Related data for selected booking
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeBlockedDates, setEmployeeBlockedDates] = useState<{ employee_id: string; date: string }[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Acceptance form
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("23:00");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [extraCosts, setExtraCosts] = useState<{ description: string; amount: string; billable: boolean }[]>([]);
  const [offerPrice, setOfferPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showPriceWarning, setShowPriceWarning] = useState(false);

  const fetchBookings = useCallback(async () => {
    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setBookings((data as Booking[]) ?? []);
  }, [supabase, filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const loadBookingData = useCallback(async (bookingId: string, bookingDate?: string) => {
    const [empRes, assignRes, costRes, offerRes, agreeRes, chatRes, blockedRes] = await Promise.all([
      supabase.from("employees").select("*").eq("is_active", true).order("name"),
      supabase.from("booking_assignments").select("*").eq("booking_id", bookingId),
      supabase.from("booking_costs").select("*").eq("booking_id", bookingId),
      supabase.from("offers").select("*").eq("booking_id", bookingId).order("created_at", { ascending: false }),
      supabase.from("agreements").select("*").eq("booking_id", bookingId),
      supabase.from("chat_messages").select("*").eq("booking_id", bookingId).order("created_at"),
      bookingDate
        ? supabase.from("employee_blocked_dates").select("employee_id, date").eq("date", bookingDate)
        : Promise.resolve({ data: [] }),
    ]);
    setEmployees((empRes.data as Employee[]) ?? []);
    setAssignments((assignRes.data as Assignment[]) ?? []);
    setCosts((costRes.data as Cost[]) ?? []);
    setOffers((offerRes.data as Offer[]) ?? []);
    setAgreements((agreeRes.data as Agreement[]) ?? []);
    setChatMessages((chatRes.data as ChatMessage[]) ?? []);
    setEmployeeBlockedDates((blockedRes.data as { employee_id: string; date: string }[]) ?? []);

    // Pre-select all active employees (excluding unavailable)
    const blocked = (blockedRes.data as { employee_id: string }[]) ?? [];
    const blockedIds = new Set(blocked.map((d) => d.employee_id));
    const assignedIds = ((assignRes.data as Assignment[]) ?? []).map((a) => a.employee_id);
    if (assignedIds.length > 0) {
      setSelectedEmployees(assignedIds.filter((id) => !blockedIds.has(id)));
    } else {
      setSelectedEmployees(((empRes.data as Employee[]) ?? []).filter((e) => !blockedIds.has(e.id)).map((e) => e.id));
    }
  }, [supabase]);

  const selectBooking = async (b: Booking) => {
    setSelected(b);
    setTab("details");
    setAdminNotes(b.admin_notes ?? "");
    setStartTime(b.start_time ?? "18:00");
    setEndTime(b.end_time ?? "23:00");
    await loadBookingData(b.id, b.date);
  };

  // Calculate hours from time range
  const calcHours = (): number => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    let start = sh + sm / 60;
    let end = eh + em / 60;
    if (end <= start) end += 24; // overnight
    return Math.round((end - start) * 100) / 100;
  };

  // Calculate estimated cost
  const estimatedLabourCost = (): number => {
    const hours = calcHours();
    return selectedEmployees.reduce((sum, empId) => {
      const emp = employees.find((e) => e.id === empId);
      return sum + (emp?.hourly_rate ?? 0) * hours;
    }, 0);
  };

  const extraCostsTotal = (): number => {
    return extraCosts.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  };

  const totalEstimatedCost = (): number => {
    return estimatedLabourCost() + extraCostsTotal();
  };

  const defaultOfferPrice = (): number => {
    return Math.ceil(totalEstimatedCost() * 1.2 / 100) * 100; // 20% markup, rounded to nearest 100
  };

  // Accept booking and create offer
  const acceptAndOffer = async () => {
    if (!selected) return;
    const price = parseFloat(offerPrice) || defaultOfferPrice();
    const cost = totalEstimatedCost();

    if (price < cost) {
      setShowPriceWarning(true);
      return;
    }

    await processAcceptance(price, cost);
  };

  const processAcceptance = async (price: number, cost: number) => {
    if (!selected) return;
    setUpdating(true);
    setShowPriceWarning(false);
    const hours = calcHours();

    // Update booking with time info
    await supabase.from("bookings").update({
      status: "offer_sent" as BookingStatus,
      start_time: startTime,
      end_time: endTime,
      estimated_hours: hours,
      admin_notes: adminNotes || null,
    }).eq("id", selected.id);

    // Upsert assignments
    await supabase.from("booking_assignments").delete().eq("booking_id", selected.id);
    if (selectedEmployees.length > 0) {
      await supabase.from("booking_assignments").insert(
        selectedEmployees.map((empId) => ({
          booking_id: selected.id,
          employee_id: empId,
        }))
      );
    }

    // Insert extra costs
    for (const c of extraCosts) {
      if (c.description && c.amount) {
        await supabase.from("booking_costs").insert({
          booking_id: selected.id,
          description: c.description,
          amount: parseFloat(c.amount) || 0,
          is_billable: c.billable,
        });
      }
    }

    // Create offer
    const { data: offerData } = await supabase.from("offers").insert({
      booking_id: selected.id,
      estimated_cost: cost,
      offered_price: price,
      markup_percent: Math.round(((price - cost) / cost) * 100 * 100) / 100,
      status: "sent",
      sent_at: new Date().toISOString(),
    }).select("id").single();

    // Add chat messages
    await supabase.from("chat_messages").insert({
      booking_id: selected.id,
      sender_type: "admin",
      sender_name: "BarPro",
      message: `Tilbud sendt: ${price.toLocaleString("no-NO")} kr`,
      message_type: "offer",
    });

    // Send offer email to customer
    if (offerData) {
      try {
        await fetch("/api/admin/send-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerId: (offerData as { id: string }).id, bookingId: selected.id }),
        });
      } catch (err) {
        console.error("Failed to send offer email:", err);
      }
    }

    setSelected({ ...selected, status: "offer_sent", start_time: startTime, end_time: endTime, estimated_hours: hours });
    setExtraCosts([]);
    await fetchBookings();
    await loadBookingData(selected.id);
    setUpdating(false);
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    setUpdating(true);
    await supabase.from("bookings").update({ status }).eq("id", id);
    if (selected?.id === id) setSelected({ ...selected, status });
    await fetchBookings();
    setUpdating(false);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setUpdating(true);
    await supabase.from("bookings").update({ admin_notes: adminNotes }).eq("id", selected.id);
    setUpdating(false);
  };

  const sendChatMessage = async () => {
    if (!selected || !chatInput.trim()) return;
    setUpdating(true);
    await supabase.from("chat_messages").insert({
      booking_id: selected.id,
      sender_type: "admin",
      sender_name: "BarPro",
      message: chatInput.trim(),
      message_type: "text",
    });
    setChatInput("");
    await loadBookingData(selected.id);
    setUpdating(false);
  };

  const formatDate = (d: string): string =>
    new Date(d + "T00:00:00").toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
  const eventLabels: Record<string, string> = { wedding: "Bryllup", corporate: "Bedrift", private: "Privat", other: "Annet" };
  const statusLabels: Record<string, string> = { pending: "Forespørsel", offer_sent: "Tilbud sendt", confirmed: "Bekreftet", cancelled: "Avlyst", completed: "Fullført" };
  const statusColors: Record<string, string> = { pending: "text-yellow-400 bg-yellow-400/10", offer_sent: "text-blue-400 bg-blue-400/10", confirmed: "text-green-400 bg-green-400/10", cancelled: "text-red-400 bg-red-400/10", completed: "text-[#6B6B6B] bg-[#6B6B6B]/10" };

  const filters: { value: BookingStatus | "all"; label: string }[] = [
    { value: "all", label: "Alle" }, { value: "pending", label: "Forespørsler" },
    { value: "offer_sent", label: "Tilbud sendt" }, { value: "confirmed", label: "Bekreftet" },
    { value: "completed", label: "Fullført" }, { value: "cancelled", label: "Avlyst" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Bookinger</h1>

      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              filter === f.value ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30" : "text-[#6B6B6B] border border-[#1E1E1E] hover:text-[#F5F0E8]"
            }`}>{f.label}</button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className={`${selected ? "w-2/5" : "w-full"} space-y-2 transition-all`}>
          {bookings.length === 0 ? (
            <div className="bg-[#141414] border border-[#1E1E1E] p-10 text-center text-[#6B6B6B] text-sm">Ingen bookinger</div>
          ) : bookings.map((b) => (
            <button key={b.id} onClick={() => selectBooking(b)}
              className={`w-full text-left bg-[#141414] border p-4 transition-colors cursor-pointer ${
                selected?.id === b.id ? "border-[#C9A84C]/40" : "border-[#1E1E1E] hover:border-[#C9A84C]/20"
              }`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{b.customer_name}</p>
                <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
              </div>
              <p className="text-[11px] text-[#6B6B6B] mt-1">{formatDate(b.date)} · {packageLabels[b.package]} · {b.guest_count}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-3/5 bg-[#141414] border border-[#1E1E1E] sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1E1E1E]">
              <div>
                <h2 className="text-lg font-medium">{selected.customer_name}</h2>
                <p className="text-[11px] text-[#6B6B6B]">{formatDate(selected.date)} · {packageLabels[selected.package]}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer text-xl">&times;</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1E1E1E]">
              {(["details", "chat", "offer", "agreement"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-[11px] tracking-wider uppercase text-center transition-colors cursor-pointer ${
                    tab === t ? "text-[#C9A84C] border-b-2 border-[#C9A84C]" : "text-[#6B6B6B]"
                  }`}>
                  {t === "details" ? "Detaljer" : t === "chat" ? `Chat (${chatMessages.length})` : t === "offer" ? `Tilbud (${offers.length})` : `Avtaler (${agreements.length})`}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* DETAILS TAB */}
              {tab === "details" && (
                <div className="space-y-5 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Type</p>
                      <p>{eventLabels[selected.event_type]}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Gjester</p>
                      <p>{selected.guest_count}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">E-post</p>
                      <a href={`mailto:${selected.customer_email}`} className="text-[#C9A84C] hover:underline">{selected.customer_email}</a>
                    </div>
                    {selected.customer_phone && (
                      <div>
                        <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Telefon</p>
                        <a href={`tel:${selected.customer_phone}`} className="text-[#C9A84C] hover:underline">{selected.customer_phone}</a>
                      </div>
                    )}
                  </div>

                  {selected.wants_callback && (
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-2 text-[11px] text-[#C9A84C]">Kunden ønsker å bli ringt opp</div>
                  )}

                  {selected.message && (
                    <div>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Kundens melding</p>
                      <p className="text-[#6B6B6B]">{selected.message}</p>
                    </div>
                  )}

                  {/* Time & Staff — shown for pending (acceptance flow) or confirmed */}
                  {(selected.status === "pending" || selected.status === "confirmed") && (
                    <div className="border-t border-[#1E1E1E] pt-5 space-y-4">
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Tid & bemanning</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6B6B6B]">Fra</label>
                          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                            className="w-full mt-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B6B6B]">Til</label>
                          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                            className="w-full mt-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B6B6B]">Timer</label>
                          <div className="mt-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm text-[#C9A84C]">{calcHours()} t</div>
                        </div>
                      </div>

                      {/* Employee selection */}
                      <div>
                        <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2">Ansatte ({selectedEmployees.length})</p>
                        <div className="space-y-1">
                          {employees.map((emp) => {
                            const isUnavailable = employeeBlockedDates.some((d) => d.employee_id === emp.id);
                            return (
                              <label key={emp.id} className={`flex items-center gap-3 py-1.5 px-2 transition-colors ${isUnavailable ? "opacity-50" : "hover:bg-[#1A1A1A] cursor-pointer"}`}>
                                <input type="checkbox" checked={selectedEmployees.includes(emp.id)}
                                  disabled={isUnavailable}
                                  onChange={(e) => {
                                    setSelectedEmployees(e.target.checked
                                      ? [...selectedEmployees, emp.id]
                                      : selectedEmployees.filter((id) => id !== emp.id));
                                  }}
                                  className="accent-[#C9A84C]" />
                                <span className="flex-1 text-sm">{emp.name}</span>
                                {isUnavailable ? (
                                  <span className="text-[10px] text-red-400">Ikke tilgjengelig</span>
                                ) : (
                                  <span className="text-[10px] text-[#6B6B6B]">{emp.hourly_rate} kr/t</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cost summary — for pending acceptance */}
                  {selected.status === "pending" && (
                    <div className="border-t border-[#1E1E1E] pt-5 space-y-4">
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Kostnadsberegning</p>

                      <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B]">Lønn ({selectedEmployees.length} pers × {calcHours()} t)</span>
                          <span>{estimatedLabourCost().toLocaleString("no-NO")} kr</span>
                        </div>
                        {extraCosts.map((c, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-[#6B6B6B]">{c.description || "Ekstra kostnad"}</span>
                            <span>{(parseFloat(c.amount) || 0).toLocaleString("no-NO")} kr</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-t border-[#1E1E1E] pt-2 font-medium">
                          <span>Estimert kostnad</span>
                          <span>{totalEstimatedCost().toLocaleString("no-NO")} kr</span>
                        </div>
                      </div>

                      {/* Add extra costs */}
                      <div>
                        <button onClick={() => setExtraCosts([...extraCosts, { description: "", amount: "", billable: true }])}
                          className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer">
                          + Legg til kostnad
                        </button>
                        {extraCosts.map((c, i) => (
                          <div key={i} className="flex gap-2 mt-2">
                            <input value={c.description} onChange={(e) => { const arr = [...extraCosts]; arr[i].description = e.target.value; setExtraCosts(arr); }}
                              placeholder="Beskrivelse" className="flex-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                            <input type="number" value={c.amount} onChange={(e) => { const arr = [...extraCosts]; arr[i].amount = e.target.value; setExtraCosts(arr); }}
                              placeholder="Beløp" className="w-24 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                            <button onClick={() => setExtraCosts(extraCosts.filter((_, j) => j !== i))}
                              className="text-red-400 hover:text-red-300 cursor-pointer px-2">&times;</button>
                          </div>
                        ))}
                      </div>

                      {/* Offer price — prominent */}
                      <div className="border-t border-[#1E1E1E] pt-6">
                        <div className="bg-[#C9A84C]/[0.06] border border-[#C9A84C]/20 p-6 text-center">
                          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-[0.25em] mb-3">Tilbudspris til kunde</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <input type="number" value={offerPrice || String(defaultOfferPrice())}
                              onChange={(e) => setOfferPrice(e.target.value)}
                              className="w-40 bg-[#0A0A0A] border border-[#C9A84C]/30 px-4 py-3 text-2xl font-semibold text-[#C9A84C] text-center outline-none focus:border-[#C9A84C]/60" />
                            <span className="text-lg text-[#C9A84C]">kr</span>
                          </div>
                          {(() => {
                            const price = parseFloat(offerPrice) || defaultOfferPrice();
                            const cost = totalEstimatedCost();
                            const profit = price - cost;
                            const margin = cost > 0 ? Math.round((profit / cost) * 100) : 0;
                            return (
                              <div className="mt-3 space-y-1 text-[12px]">
                                <div className="flex justify-between">
                                  <span className="text-[#6B6B6B]">Kostnad</span>
                                  <span className="text-[#F5F0E8]">{cost.toLocaleString("no-NO")} kr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#6B6B6B]">Inntekt</span>
                                  <span className={profit >= 0 ? "text-green-400/80" : "text-red-400/80"}>
                                    {profit >= 0 ? "+" : ""}{profit.toLocaleString("no-NO")} kr
                                  </span>
                                </div>
                                <div className="flex justify-between border-t border-[#1E1E1E] pt-1">
                                  <span className="text-[#6B6B6B]">Margin</span>
                                  <span className={margin >= 0 ? "text-green-400/80" : "text-red-400/80"}>
                                    {margin}%
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <button onClick={saveNotes} disabled={updating}
                          className="flex-1 border border-[#1E1E1E] py-3 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] hover:border-[#C9A84C]/20 transition-colors cursor-pointer disabled:opacity-50">
                          Lagre utkast
                        </button>
                        <button onClick={acceptAndOffer} disabled={updating || selectedEmployees.length === 0}
                          className="flex-1 bg-green-400/10 text-green-400 border border-green-400/30 py-3 text-xs uppercase tracking-wider hover:bg-green-400/20 transition-colors cursor-pointer disabled:opacity-50">
                          {updating ? "Behandler..." : "Godkjenn & send tilbud"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing costs for confirmed bookings */}
                  {costs.length > 0 && selected.status !== "pending" && (
                    <div className="border-t border-[#1E1E1E] pt-4">
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2">Kostnader</p>
                      {costs.map((c) => (
                        <div key={c.id} className="flex justify-between text-sm py-1">
                          <span className="text-[#6B6B6B]">{c.description}</span>
                          <span>{c.amount.toLocaleString("no-NO")} kr</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin notes */}
                  <div className="border-t border-[#1E1E1E] pt-4">
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2">Interne notater</p>
                    <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2}
                      className="w-full bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 resize-none"
                      placeholder="Notater..." />
                  </div>

                  {/* Status actions */}
                  {selected.status === "offer_sent" && (
                    <div className="border-t border-[#1E1E1E] pt-4">
                      <p className="text-[11px] text-blue-400 mb-2">Venter på svar fra kunde</p>
                    </div>
                  )}
                  {selected.status === "confirmed" && (
                    <button onClick={() => updateStatus(selected.id, "completed")} disabled={updating}
                      className="w-full bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
                      Marker som fullført
                    </button>
                  )}
                </div>
              )}

              {/* CHAT TAB */}
              {tab === "chat" && (
                <div className="flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.length === 0 ? (
                      <p className="text-[#6B6B6B] text-sm text-center py-8">Ingen meldinger ennå</p>
                    ) : chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] ${
                          msg.sender_type === "admin"
                            ? "bg-[#C9A84C]/10 border border-[#C9A84C]/20"
                            : "bg-[#1A1A1A] border border-[#1E1E1E]"
                        } p-3`}>
                          <p className="text-[10px] text-[#6B6B6B] mb-1">{msg.sender_name}</p>
                          {msg.message_type === "offer" ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9A84C] text-xs">&#9733;</span>
                              <p className="text-sm font-medium text-[#C9A84C]">{msg.message}</p>
                            </div>
                          ) : msg.message_type === "agreement" ? (
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 text-xs">&#10003;</span>
                              <p className="text-sm font-medium text-green-400">{msg.message}</p>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.message}</p>
                          )}
                          <p className="text-[9px] text-[#6B6B6B]/50 mt-1">
                            {new Date(msg.created_at).toLocaleString("no-NO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                      placeholder="Skriv en melding..."
                      className="flex-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                    <button onClick={sendChatMessage} disabled={updating || !chatInput.trim()}
                      className="bg-[#C9A84C] text-[#0A0A0A] px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#D4AF57] cursor-pointer disabled:opacity-50">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* OFFER TAB */}
              {tab === "offer" && (
                <div className="space-y-4">
                  {offers.length === 0 ? (
                    <p className="text-[#6B6B6B] text-sm text-center py-8">Ingen tilbud opprettet</p>
                  ) : offers.map((o) => (
                    <div key={o.id} className="bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${
                          o.status === "accepted" ? "text-green-400 bg-green-400/10" :
                          o.status === "sent" ? "text-[#C9A84C] bg-[#C9A84C]/10" :
                          o.status === "declined" ? "text-red-400 bg-red-400/10" :
                          "text-[#6B6B6B] bg-[#6B6B6B]/10"
                        }`}>{o.status}</span>
                        <span className="text-[10px] text-[#6B6B6B]">
                          {new Date(o.created_at).toLocaleDateString("no-NO")}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] text-[#6B6B6B]">Kostnad</p>
                          <p>{o.estimated_cost.toLocaleString("no-NO")} kr</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#6B6B6B]">Tilbud</p>
                          <p className="text-[#C9A84C] font-medium">{o.offered_price.toLocaleString("no-NO")} kr</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#6B6B6B]">Margin</p>
                          <p>{o.markup_percent}%</p>
                        </div>
                      </div>
                      <button onClick={() => setTab("chat")}
                        className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer">
                        Gå til meldinger &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* AGREEMENT TAB */}
              {tab === "agreement" && (
                <div className="space-y-4">
                  {agreements.length === 0 ? (
                    <p className="text-[#6B6B6B] text-sm text-center py-8">Ingen avtaler</p>
                  ) : agreements.map((a) => (
                    <div key={a.id} className="bg-[#0A0A0A] border border-[#1E1E1E] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${
                          a.status === "active" ? "text-green-400 bg-green-400/10" :
                          a.status === "completed" ? "text-[#6B6B6B] bg-[#6B6B6B]/10" :
                          "text-red-400 bg-red-400/10"
                        }`}>{a.status === "active" ? "Aktiv" : a.status === "completed" ? "Fullført" : "Kansellert"}</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-[10px] text-[#6B6B6B]">Endelig pris</p>
                        <p className="text-lg font-medium text-green-400">{a.final_price.toLocaleString("no-NO")} kr</p>
                      </div>
                      {a.notes && <p className="text-[11px] text-[#6B6B6B]">{a.notes}</p>}
                      {a.signed_at && (
                        <p className="text-[10px] text-[#6B6B6B]">
                          Signert {new Date(a.signed_at).toLocaleDateString("no-NO")}
                        </p>
                      )}
                      <button onClick={() => setTab("chat")}
                        className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer">
                        Gå til meldinger &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price warning modal */}
      {showPriceWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowPriceWarning(false)}>
          <div className="bg-[#141414] border border-red-400/30 p-8 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-medium text-red-400 mb-3">Advarsel: Lav pris</h3>
            <p className="text-sm text-[#6B6B6B] mb-2">
              Tilbudsprisen ({(parseFloat(offerPrice) || defaultOfferPrice()).toLocaleString("no-NO")} kr) er lavere enn estimert kostnad ({totalEstimatedCost().toLocaleString("no-NO")} kr).
            </p>
            <p className="text-sm text-[#6B6B6B] mb-6">Er du sikker på at du vil sende dette tilbudet?</p>
            <div className="flex gap-2">
              <button onClick={() => processAcceptance(parseFloat(offerPrice) || defaultOfferPrice(), totalEstimatedCost())}
                disabled={updating}
                className="flex-1 bg-red-400/10 text-red-400 border border-red-400/30 py-2 text-xs uppercase tracking-wider hover:bg-red-400/20 cursor-pointer disabled:opacity-50">
                {updating ? "Sender..." : "Ja, send likevel"}
              </button>
              <button onClick={() => setShowPriceWarning(false)}
                className="flex-1 border border-[#1E1E1E] py-2 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] cursor-pointer">
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
