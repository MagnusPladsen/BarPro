"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({ thisMonth: 0, pending: 0, unread: 0 });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().split("T")[0];

    // Fetch pending bookings
    supabase
      .from("bookings")
      .select("*")
      .eq("status", "pending")
      .order("date", { ascending: true })
      .limit(5)
      .then(({ data }) => {
        setPendingBookings((data as Booking[]) ?? []);
        setStats((s) => ({ ...s, pending: data?.length ?? 0 }));
      });

    // Fetch upcoming confirmed bookings
    supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(5)
      .then(({ data }) => setUpcomingBookings((data as Booking[]) ?? []));

    // This month's bookings count
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("date", monthStart)
      .in("status", ["pending", "confirmed"])
      .then(({ count }) => setStats((s) => ({ ...s, thisMonth: count ?? 0 })));

    // Unread messages
    supabase
      .from("contact_messages")
      .select("*")
      .eq("status", "unread")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setUnreadMessages((data as Message[]) ?? []);
        setStats((s) => ({ ...s, unread: data?.length ?? 0 }));
      });
  }, [supabase]);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("no-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const packageLabels: Record<string, string> = {
    basis: "Basis",
    premium: "Premium",
    eksklusiv: "Eksklusiv",
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    confirmed: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    completed: "text-[#6B6B6B] bg-[#6B6B6B]/10",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link
          href="/admin/bookinger"
          className="bg-[#141414] border border-[#1E1E1E] p-6 hover:border-[#C9A84C]/30 transition-colors duration-300"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">Ventende</p>
          <p className="text-3xl font-semibold text-[#C9A84C]">{stats.pending}</p>
        </Link>
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">Denne måneden</p>
          <p className="text-3xl font-semibold">{stats.thisMonth}</p>
        </div>
        <Link
          href="/admin/meldinger"
          className="bg-[#141414] border border-[#1E1E1E] p-6 hover:border-[#C9A84C]/30 transition-colors duration-300"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">Uleste meldinger</p>
          <p className="text-3xl font-semibold text-[#C9A84C]">{stats.unread}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending bookings */}
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium">Ventende forespørsler</h2>
            <Link href="/admin/bookinger" className="text-[11px] text-[#C9A84C] hover:underline">
              Se alle
            </Link>
          </div>
          {pendingBookings.length === 0 ? (
            <p className="text-[#6B6B6B] text-sm">Ingen ventende forespørsler</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookinger?id=${b.id}`}
                  className="flex items-center justify-between py-3 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A] -mx-2 px-2 transition-colors"
                >
                  <div>
                    <p className="text-sm">{b.customer_name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{formatDate(b.date)} · {packageLabels[b.package]}</p>
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming confirmed */}
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium">Kommende bookinger</h2>
            <Link href="/admin/kalender" className="text-[11px] text-[#C9A84C] hover:underline">
              Kalender
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-[#6B6B6B] text-sm">Ingen kommende bookinger</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookinger?id=${b.id}`}
                  className="flex items-center justify-between py-3 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A] -mx-2 px-2 transition-colors"
                >
                  <div>
                    <p className="text-sm">{b.customer_name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{formatDate(b.date)} · {packageLabels[b.package]}</p>
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[b.status]}`}>
                    Bekreftet
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent messages */}
      {unreadMessages.length > 0 && (
        <div className="mt-8 bg-[#141414] border border-[#1E1E1E] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium">Nye meldinger</h2>
            <Link href="/admin/meldinger" className="text-[11px] text-[#C9A84C] hover:underline">
              Se alle
            </Link>
          </div>
          <div className="space-y-3">
            {unreadMessages.map((m) => (
              <Link
                key={m.id}
                href={`/admin/meldinger?id=${m.id}`}
                className="block py-3 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A] -mx-2 px-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">{m.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    {new Date(m.created_at).toLocaleDateString("no-NO")}
                  </p>
                </div>
                <p className="text-[11px] text-[#6B6B6B] mt-1 line-clamp-1">{m.message}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
