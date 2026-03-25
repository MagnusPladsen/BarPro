"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { KPICardSkeleton, DashboardListSkeleton } from "@/components/ui/LoadingState";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Message = Database["public"]["Tables"]["contact_messages"]["Row"];
type Agreement = Database["public"]["Tables"]["agreements"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"];

interface MonthStats {
  revenue: number;
  bookings: number;
  hours: number;
  avgValue: number;
  labourCost: number;
}

function getMonthRange(offset: number): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function ChangeIndicator({ current, previous, suffix = "" }: { current: number; previous: number; suffix?: string }) {
  const pct = pctChange(current, previous);
  if (pct === null) return null;
  const isUp = pct >= 0;
  return (
    <span className={`text-[11px] ${isUp ? "text-green-400" : "text-red-400"}`}>
      {isUp ? "+" : ""}{pct}%{suffix}
    </span>
  );
}

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [thisMonth, setThisMonth] = useState<MonthStats>({ revenue: 0, bookings: 0, hours: 0, avgValue: 0, labourCost: 0 });
  const [lastMonth, setLastMonth] = useState<MonthStats>({ revenue: 0, bookings: 0, hours: 0, avgValue: 0, labourCost: 0 });
  const [pendingCount, setPendingCount] = useState(0);
  const [offerSentCount, setOfferSentCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const thisRange = getMonthRange(0);
    const lastRange = getMonthRange(-1);

    async function fetchMonthStats(range: { start: string; end: string }): Promise<MonthStats> {
      const [agreementsRes, bookingsRes, assignmentsRes] = await Promise.all([
        supabase.from("agreements").select("final_price").gte("created_at", range.start + "T00:00:00").lte("created_at", range.end + "T23:59:59"),
        supabase.from("bookings").select("id").gte("date", range.start).lte("date", range.end).in("status", ["confirmed", "completed", "offer_sent"]),
        supabase.from("booking_assignments").select("hours_worked, extra_pay, employees(hourly_rate)").eq("approved", true),
      ]);

      const agreements = (agreementsRes.data ?? []) as Pick<Agreement, "final_price">[];
      const revenue = agreements.reduce((s, a) => s + a.final_price, 0);
      const bookingCount = (bookingsRes.data ?? []).length;
      const assignments = (assignmentsRes.data ?? []) as (Pick<Assignment, "hours_worked" | "extra_pay"> & { employees: { hourly_rate: number } | null })[];
      const hours = assignments.reduce((s, a) => s + (a.hours_worked ?? 0), 0);
      const labourCost = assignments.reduce((s, a) => {
        return s + ((a.hours_worked ?? 0) * (a.employees?.hourly_rate ?? 0)) + (a.extra_pay ?? 0);
      }, 0);

      return {
        revenue,
        bookings: bookingCount,
        hours,
        avgValue: bookingCount > 0 ? Math.round(revenue / bookingCount) : 0,
        labourCost,
      };
    }

    // Fetch all data in parallel
    Promise.all([
      fetchMonthStats(thisRange),
      fetchMonthStats(lastRange),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "offer_sent"),
      supabase.from("contact_messages").select("*").eq("status", "unread").order("created_at", { ascending: false }).limit(5),
      supabase.from("employees").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("bookings").select("*").eq("status", "confirmed").gte("date", today).order("date").limit(5),
    ]).then(([t, l, pendingRes, offerRes, msgRes, empRes, recentRes, upcomingRes]) => {
      setThisMonth(t);
      setLastMonth(l);
      setPendingCount(pendingRes.count ?? 0);
      setOfferSentCount(offerRes.count ?? 0);
      const msgs = (msgRes.data as Message[]) ?? [];
      setUnreadMessages(msgs);
      setUnreadCount(msgs.length);
      setActiveEmployees(empRes.count ?? 0);
      setRecentBookings((recentRes.data as Booking[]) ?? []);
      setUpcomingBookings((upcomingRes.data as Booking[]) ?? []);
      setLoading(false);
    });
  }, [supabase]);

  const formatDate = (d: string): string =>
    new Date(d + "T00:00:00").toLocaleDateString("no-NO", { day: "numeric", month: "short" });

  const formatMoney = (n: number): string => n.toLocaleString("no-NO");

  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
  const statusLabels: Record<string, string> = { pending: "Forespørsel", offer_sent: "Tilbud sendt", confirmed: "Bekreftet", cancelled: "Avlyst", completed: "Fullført" };
  const statusColors: Record<string, string> = { pending: "text-yellow-400 bg-yellow-400/10", offer_sent: "text-blue-400 bg-blue-400/10", confirmed: "text-green-400 bg-green-400/10", cancelled: "text-red-400 bg-red-400/10", completed: "text-[#6B5D52] bg-[#6B5D52]/10" };

  const margin = thisMonth.revenue - thisMonth.labourCost;
  const lastMargin = lastMonth.revenue - lastMonth.labourCost;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-[11px] text-[#6B5D52] tracking-wider">
          {new Date().toLocaleDateString("no-NO", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          value={searchQuery}
          onChange={(e) => {
            const q = e.target.value;
            setSearchQuery(q);
            if (q.length < 2) { setSearchResults([]); return; }
            // Debounce search
            clearTimeout((window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer);
            (window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(async () => {
              setSearching(true);
              const { data } = await supabase.from("bookings").select("*").ilike("customer_name", `%${q}%`).limit(5);
              setSearchResults((data as Booking[]) ?? []);
              setSearching(false);
            }, 300);
          }}
          placeholder="Søk etter kunde, booking..."
          className="w-full bg-[#1A1410] border border-[#1A1410] px-4 py-3 text-sm outline-none focus:border-[#C4907A]/40 transition-colors placeholder:text-[#6B5D52]/40"
        />
        {searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-[#1A1410] border border-[#1A1410] border-t-0 max-h-[300px] overflow-y-auto">
            {searching ? (
              <p className="p-4 text-[#6B5D52] text-sm">Søker...</p>
            ) : searchResults.length === 0 ? (
              <p className="p-4 text-[#6B5D52] text-sm">Ingen treff</p>
            ) : searchResults.map((b) => (
              <Link key={b.id} href="/admin/bookinger" onClick={() => setSearchQuery("")}
                className="flex items-center justify-between p-3 hover:bg-[#2A211A] transition-colors border-b border-[#1A1410] last:border-0">
                <div>
                  <p className="text-sm">{b.customer_name}</p>
                  <p className="text-[10px] text-[#6B5D52]">{formatDate(b.date)} · {packageLabels[b.package]}</p>
                </div>
                <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards — Top Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            {/* Revenue */}
            <div className="bg-[#1A1410] border border-[#1A1410] p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Inntekt</p>
                <ChangeIndicator current={thisMonth.revenue} previous={lastMonth.revenue} suffix=" vs forrige" />
              </div>
              <p className="text-2xl font-semibold text-green-400">{formatMoney(thisMonth.revenue)} kr</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Forrige: {formatMoney(lastMonth.revenue)} kr</p>
            </div>

            {/* Margin */}
            <div className="bg-[#1A1410] border border-[#1A1410] p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Margin</p>
                <ChangeIndicator current={margin} previous={lastMargin} />
              </div>
              <p className={`text-2xl font-semibold ${margin >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatMoney(margin)} kr
              </p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Kostnad: {formatMoney(thisMonth.labourCost)} kr</p>
            </div>

            {/* Bookings */}
            <div className="bg-[#1A1410] border border-[#1A1410] p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Bookinger</p>
                <ChangeIndicator current={thisMonth.bookings} previous={lastMonth.bookings} />
              </div>
              <p className="text-2xl font-semibold">{thisMonth.bookings}</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Forrige: {lastMonth.bookings}</p>
            </div>

            {/* Avg value */}
            <div className="bg-[#1A1410] border border-[#1A1410] p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Snittverdi</p>
                <ChangeIndicator current={thisMonth.avgValue} previous={lastMonth.avgValue} />
              </div>
              <p className="text-2xl font-semibold">{formatMoney(thisMonth.avgValue)} kr</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Per booking</p>
            </div>
          </>
        )}
      </div>

      {/* Action Cards — Second Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <Link href="/admin/bookinger" className="bg-[#1A1410] border border-[#1A1410] p-5 hover:border-yellow-400/30 transition-colors">
              <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Forespørsler</p>
              <p className="text-2xl font-semibold text-yellow-400">{pendingCount}</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Venter på behandling</p>
            </Link>

            <Link href="/admin/bookinger" className="bg-[#1A1410] border border-[#1A1410] p-5 hover:border-blue-400/30 transition-colors">
              <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Tilbud sendt</p>
              <p className="text-2xl font-semibold text-blue-400">{offerSentCount}</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Venter på kundesvar</p>
            </Link>

            <Link href="/admin/meldinger" className="bg-[#1A1410] border border-[#1A1410] p-5 hover:border-[#C4907A]/30 transition-colors">
              <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Uleste meldinger</p>
              <p className="text-2xl font-semibold text-[#C4907A]">{unreadCount}</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Fra kontaktskjema</p>
            </Link>

            <Link href="/admin/ansatte" className="bg-[#1A1410] border border-[#1A1410] p-5 hover:border-[#C4907A]/30 transition-colors">
              <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Aktive ansatte</p>
              <p className="text-2xl font-semibold">{activeEmployees}</p>
              <p className="text-[10px] text-[#6B5D52] mt-1">Timer: {thisMonth.hours} t denne mnd</p>
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming confirmed */}
        <div className="bg-[#1A1410] border border-[#1A1410] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium">Kommende arrangementer</h2>
            <div className="flex items-center gap-3">
              <a href="/api/admin/google-calendar" className="text-[10px] text-[#6B5D52] hover:text-[#E8DDD4] transition-colors">.ics</a>
              <Link href="/admin/kalender" className="text-[11px] text-[#C4907A] hover:underline">Kalender</Link>
            </div>
          </div>
          {loading ? (
            <DashboardListSkeleton />
          ) : upcomingBookings.length === 0 ? (
            <p className="text-[#6B5D52] text-sm py-4">Ingen kommende arrangementer</p>
          ) : (
            <div className="space-y-0">
              {upcomingBookings.map((b) => (
                <Link key={b.id} href={`/admin/bookinger`}
                  className="flex items-center justify-between py-3 border-b border-[#1A1410] last:border-0 hover:bg-[#2A211A] -mx-2 px-2 transition-colors">
                  <div>
                    <p className="text-sm">{b.customer_name}</p>
                    <p className="text-[11px] text-[#6B5D52]">
                      {formatDate(b.date)}
                      {b.start_time && ` · ${b.start_time}–${b.end_time}`}
                      {` · ${packageLabels[b.package]}`}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#6B5D52]">{b.guest_count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-[#1A1410] border border-[#1A1410] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium">Siste aktivitet</h2>
            <Link href="/admin/bookinger" className="text-[11px] text-[#C4907A] hover:underline">Se alle</Link>
          </div>
          {loading ? (
            <DashboardListSkeleton />
          ) : recentBookings.length === 0 ? (
            <p className="text-[#6B5D52] text-sm py-4">Ingen bookinger ennå</p>
          ) : (
            <div className="space-y-0">
              {recentBookings.map((b) => (
                <Link key={b.id} href={`/admin/bookinger`}
                  className="flex items-center justify-between py-3 border-b border-[#1A1410] last:border-0 hover:bg-[#2A211A] -mx-2 px-2 transition-colors">
                  <div>
                    <p className="text-sm">{b.customer_name}</p>
                    <p className="text-[11px] text-[#6B5D52]">{formatDate(b.date)} · {packageLabels[b.package]}</p>
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Unread messages */}
        {unreadMessages.length > 0 && (
          <div className="bg-[#1A1410] border border-[#1A1410] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium">Nye meldinger</h2>
              <Link href="/admin/meldinger" className="text-[11px] text-[#C4907A] hover:underline">Se alle</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unreadMessages.map((m) => (
                <Link key={m.id} href="/admin/meldinger"
                  className="flex items-start gap-3 py-3 px-3 border border-[#1A1410] hover:border-[#C4907A]/20 transition-colors">
                  <div className="w-2 h-2 bg-[#C4907A] mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-[10px] text-[#6B5D52] shrink-0 ml-2">
                        {new Date(m.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#6B5D52] line-clamp-1 mt-0.5">{m.message}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
