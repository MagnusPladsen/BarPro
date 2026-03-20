"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"] & {
  employees?: { name: string; hourly_rate: number } | null;
  bookings?: { date: string; customer_name: string; package: string } | null;
};
type Offer = Database["public"]["Tables"]["offers"]["Row"];
type Agreement = Database["public"]["Tables"]["agreements"]["Row"];

type Period = "week" | "month" | "custom";

export default function RapporterPage() {
  const supabase = createClient();
  const [period, setPeriod] = useState<Period>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  // Set date range based on period
  useEffect(() => {
    const now = new Date();
    if (period === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay() + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    } else if (period === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [period]);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;

    const [bookingsRes, assignmentsRes, employeesRes, offersRes, agreementsRes] = await Promise.all([
      supabase.from("bookings").select("*").gte("date", startDate).lte("date", endDate),
      supabase.from("booking_assignments").select("*, employees(name, hourly_rate), bookings(date, customer_name, package)").gte("created_at", startDate + "T00:00:00").lte("created_at", endDate + "T23:59:59"),
      supabase.from("employees").select("*").eq("is_active", true),
      supabase.from("offers").select("*").gte("created_at", startDate + "T00:00:00").lte("created_at", endDate + "T23:59:59"),
      supabase.from("agreements").select("*").gte("created_at", startDate + "T00:00:00").lte("created_at", endDate + "T23:59:59"),
    ]);

    setBookings((bookingsRes.data as Booking[]) ?? []);
    setAssignments((assignmentsRes.data as Assignment[]) ?? []);
    setEmployees((employeesRes.data as Employee[]) ?? []);
    setOffers((offersRes.data as Offer[]) ?? []);
    setAgreements((agreementsRes.data as Agreement[]) ?? []);
  }, [supabase, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculations
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const totalRevenue = agreements.reduce((sum, a) => sum + a.final_price, 0);
  const pendingOffers = offers.filter((o) => o.status === "sent").reduce((sum, o) => sum + o.offered_price, 0);
  const totalHours = assignments.filter((a) => a.approved).reduce((sum, a) => sum + (a.hours_worked ?? 0), 0);
  const totalLabourCost = assignments.filter((a) => a.approved).reduce((sum, a) => {
    const rate = a.employees?.hourly_rate ?? 0;
    const hours = a.hours_worked ?? 0;
    const extra = a.extra_pay ?? 0;
    return sum + (rate * hours) + extra;
  }, 0);

  // Per-employee breakdown
  const employeeStats = employees.map((emp) => {
    const empAssignments = assignments.filter((a) => {
      return a.employees?.name === emp.name;
    });
    const hours = empAssignments.filter((a) => a.approved).reduce((s, a) => s + (a.hours_worked ?? 0), 0);
    const salary = hours * emp.hourly_rate + empAssignments.reduce((s, a) => s + (a.extra_pay ?? 0), 0);
    return { ...emp, hours, salary, jobCount: empAssignments.length };
  }).filter((e) => e.jobCount > 0);

  const exportCSV = () => {
    const headers = ["Ansatt", "Rolle", "Timer", "Timelønn", "Ekstra", "Total lønn", "Antall oppdrag"];
    const rows = employeeStats.map((e) => [
      e.name, e.role, e.hours, e.hourly_rate, 0, e.salary, e.jobCount,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barpro-rapport-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Rapporter</h1>
        <button
          onClick={exportCSV}
          className="border border-[#C9A84C]/30 text-[#C9A84C] px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors cursor-pointer"
        >
          Eksporter CSV
        </button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          {(["week", "month", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                period === p
                  ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30"
                  : "text-[#6B6B6B] border border-[#1E1E1E] hover:text-[#F5F0E8]"
              }`}
            >
              {p === "week" ? "Denne uken" : p === "month" ? "Denne måneden" : "Egendefinert"}
            </button>
          ))}
        </div>
        {period === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40"
            />
            <span className="text-[#6B6B6B]">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40"
            />
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Inntekt</p>
          <p className="text-2xl font-semibold text-green-400">{totalRevenue.toLocaleString("no-NO")} kr</p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Lønnskostnad</p>
          <p className="text-2xl font-semibold text-red-400">{totalLabourCost.toLocaleString("no-NO")} kr</p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Margin</p>
          <p className={`text-2xl font-semibold ${totalRevenue - totalLabourCost >= 0 ? "text-green-400" : "text-red-400"}`}>
            {(totalRevenue - totalLabourCost).toLocaleString("no-NO")} kr
          </p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Ventende tilbud</p>
          <p className="text-2xl font-semibold text-[#C9A84C]">{pendingOffers.toLocaleString("no-NO")} kr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking overview */}
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <h2 className="text-sm font-medium mb-4">Bookinger</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Bekreftet / Fullført</span>
              <span className="text-green-400">{confirmedBookings.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Ventende</span>
              <span className="text-yellow-400">{pendingBookings.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Avlyst</span>
              <span className="text-red-400">{bookings.filter((b) => b.status === "cancelled").length}</span>
            </div>
            <div className="flex justify-between border-t border-[#1E1E1E] pt-3">
              <span className="text-[#6B6B6B]">Totalt</span>
              <span>{bookings.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Timer jobbet</span>
              <span>{totalHours} t</span>
            </div>
          </div>
        </div>

        {/* Employee hours */}
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <h2 className="text-sm font-medium mb-4">Ansatt-timer & lønn</h2>
          {employeeStats.length === 0 ? (
            <p className="text-[#6B6B6B] text-sm">Ingen registrerte timer i perioden</p>
          ) : (
            <div className="space-y-3">
              {employeeStats.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#1E1E1E] last:border-0">
                  <div>
                    <p className="text-sm">{e.name}</p>
                    <p className="text-[10px] text-[#6B6B6B]">{e.jobCount} oppdrag · {e.hours} timer</p>
                  </div>
                  <p className="text-sm font-medium">{e.salary.toLocaleString("no-NO")} kr</p>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-sm font-medium">
                <span>Total</span>
                <span>{totalLabourCost.toLocaleString("no-NO")} kr</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
