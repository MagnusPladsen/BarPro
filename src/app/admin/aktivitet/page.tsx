"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database } from "@/lib/supabase/types";

type LogEntry = Database["public"]["Tables"]["activity_log"]["Row"];

export default function ActivityLogPage() {
  const supabase = createClient();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  const fetchLog = useCallback(async () => {
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setEntries((data as LogEntry[]) ?? []);
  }, [supabase, page]);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  const actionLabels: Record<string, string> = {
    "booking.offer_sent": "Sendte tilbud",
    "booking.confirmed": "Booking bekreftet",
    "booking.cancelled": "Booking avlyst",
    "booking.completed": "Booking fullført",
    "employee.created": "Opprettet ansatt",
    "employee.updated": "Oppdaterte ansatt",
    "time_entry.approved": "Godkjente timer",
    "time_entry.rejected": "Avviste timer",
    "date.blocked": "Blokkerte dato",
    "date.unblocked": "Fjernet blokkering",
    "message.replied": "Svarte på melding",
  };

  const entityIcons: Record<string, string> = {
    booking: "text-[#B88E64]",
    employee: "text-blue-400",
    time_entry: "text-green-400",
    date: "text-red-400",
    message: "text-purple-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Aktivitetslogg</h1>

      {entries.length === 0 ? (
        <div className="bg-[#1A1410] border border-[#1A1410] p-10 text-center text-[#6B5D52] text-sm">
          Ingen aktivitet registrert
        </div>
      ) : (
        <div className="space-y-0">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-4 py-3 border-b border-[#1A1410]">
              <div className={`w-2 h-2 mt-1.5 shrink-0 ${entityIcons[entry.entity_type] ?? "text-[#6B5D52]"}`}>
                <div className="w-2 h-2 bg-current" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="text-[#E8DDD4]">{actionLabels[entry.action] ?? entry.action}</span>
                  {entry.details && <span className="text-[#6B5D52]"> — {entry.details}</span>}
                </p>
                <p className="text-[10px] text-[#6B5D52] mt-0.5">{entry.user_email}</p>
              </div>
              <p className="text-[10px] text-[#6B5D52] shrink-0">
                {new Date(entry.created_at).toLocaleString("no-NO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
          className="px-3 py-1.5 text-xs text-[#6B5D52] border border-[#1A1410] hover:text-[#E8DDD4] cursor-pointer disabled:opacity-30">&larr;</button>
        <span className="text-[11px] text-[#6B5D52]">Side {page + 1}</span>
        <button onClick={() => setPage(page + 1)} disabled={entries.length < PAGE_SIZE}
          className="px-3 py-1.5 text-xs text-[#6B5D52] border border-[#1A1410] hover:text-[#E8DDD4] cursor-pointer disabled:opacity-30">&rarr;</button>
      </div>
    </div>
  );
}
