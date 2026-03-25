"use client";

import { useEffect, useState, useCallback } from "react";
import type { Database } from "@/lib/supabase/types";
import { TableSkeleton, KPICardSkeleton } from "@/components/ui/LoadingState";
import { ButtonSpinner } from "@/components/ui/Skeleton";

type TimeEntry = Database["public"]["Tables"]["time_entries"]["Row"] & {
  employees?: { name: string; role: string; hourly_rate: number } | null;
};

type Filter = "pending" | "approved" | "rejected" | "all";

export default function AdminTimerPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/timer?status=${filter}`);
      const data = await res.json();
      setEntries((data.entries as TimeEntry[]) ?? []);
    } catch { /* fail silently */ }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const updateEntry = async (id: string, status: "approved" | "rejected") => {
    setUpdating(true);
    await fetch("/api/admin/timer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchEntries();
    setNotification({ type: "success", message: status === "approved" ? "Timer godkjent" : "Timer avvist" });
    setTimeout(() => setNotification(null), 3000);
    setUpdating(false);
  };

  const approveAll = async () => {
    setUpdating(true);
    const pendingIds = entries.filter((e) => e.status === "pending").map((e) => e.id);
    await fetch("/api/admin/timer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: pendingIds, status: "approved" }),
    });
    await fetchEntries();
    setNotification({ type: "success", message: `${pendingIds.length} registreringer godkjent` });
    setTimeout(() => setNotification(null), 3000);
    setUpdating(false);
  };

  const filters: { value: Filter; label: string }[] = [
    { value: "pending", label: "Ventende" },
    { value: "approved", label: "Godkjent" },
    { value: "rejected", label: "Avvist" },
    { value: "all", label: "Alle" },
  ];

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const totalPendingHours = entries.filter((e) => e.status === "pending").reduce((s, e) => s + e.hours, 0);
  const totalPendingCost = entries.filter((e) => e.status === "pending").reduce((s, e) => s + e.hours * (e.employees?.hourly_rate ?? 0), 0);

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 border text-sm ${
          notification.type === "success" ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"
        }`}>{notification.message}</div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Timeregistreringer</h1>
        {filter === "pending" && pendingCount > 0 && (
          <button onClick={approveAll} disabled={updating}
            className="bg-green-400/10 text-green-400 border border-green-400/30 px-4 py-2 text-xs uppercase tracking-wider hover:bg-green-400/20 cursor-pointer disabled:opacity-50">
            {updating ? <span className="flex items-center gap-1.5"><ButtonSpinner />Godkjenner...</span> : `Godkjenn alle (${pendingCount})`}
          </button>
        )}
      </div>

      {/* Summary for pending */}
      {loading && filter === "pending" ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
        </div>
      ) : filter === "pending" && pendingCount > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1A1410] border border-[#1A1410] p-4">
            <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Ventende</p>
            <p className="text-xl font-semibold text-yellow-400">{pendingCount}</p>
          </div>
          <div className="bg-[#1A1410] border border-[#1A1410] p-4">
            <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Timer</p>
            <p className="text-xl font-semibold">{totalPendingHours} t</p>
          </div>
          <div className="bg-[#1A1410] border border-[#1A1410] p-4">
            <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Estimert kostnad</p>
            <p className="text-xl font-semibold">{totalPendingCost.toLocaleString("no-NO")} kr</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-[#B88E64]/10 text-[#B88E64] border border-[#B88E64]/30"
                : "text-[#6B5D52] border border-[#1A1410] hover:text-[#E8DDD4]"
            }`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : entries.length === 0 ? (
        <div className="bg-[#1A1410] border border-[#1A1410] p-10 text-center text-[#6B5D52] text-sm">
          Ingen registreringer
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="bg-[#1A1410] border border-[#1A1410] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">{e.employees?.name ?? "Ukjent"}</p>
                  <p className="text-[10px] text-[#6B5D52]">{e.employees?.role}</p>
                </div>
                <div className="text-[11px] text-[#6B5D52]">
                  {new Date(e.date + "T00:00:00").toLocaleDateString("no-NO", { weekday: "short", day: "numeric", month: "short" })}
                  {e.start_time && ` · ${e.start_time}–${e.end_time}`}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{e.hours} t</p>
                  <p className="text-[10px] text-[#6B5D52]">
                    {(e.hours * (e.employees?.hourly_rate ?? 0)).toLocaleString("no-NO")} kr
                  </p>
                </div>
                {e.description && (
                  <p className="text-[11px] text-[#6B5D52] max-w-[150px] truncate">{e.description}</p>
                )}

                {e.status === "pending" ? (
                  <div className="flex gap-1">
                    <button onClick={() => updateEntry(e.id, "approved")} disabled={updating}
                      className="bg-green-400/10 text-green-400 border border-green-400/30 px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-green-400/20 cursor-pointer disabled:opacity-50">
                      Godkjenn
                    </button>
                    <button onClick={() => updateEntry(e.id, "rejected")} disabled={updating}
                      className="bg-red-400/10 text-red-400 border border-red-400/30 px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-red-400/20 cursor-pointer disabled:opacity-50">
                      Avvis
                    </button>
                  </div>
                ) : (
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${
                    e.status === "approved" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                  }`}>{e.status === "approved" ? "Godkjent" : "Avvist"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
