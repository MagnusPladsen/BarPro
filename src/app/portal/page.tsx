"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"] & {
  bookings?: { date: string; customer_name: string; package: string; start_time: string | null; end_time: string | null; status: string } | null;
};

export default function PortalPage() {
  const supabase = createClient();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editing, setEditing] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [hourInputs, setHourInputs] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (!emp) { router.push("/login"); return; }
    const employee = emp as Employee;
    setEmployee(employee);
    setEditPhone(employee.phone ?? "");

    const { data: assignments } = await supabase
      .from("booking_assignments")
      .select("*, bookings(date, customer_name, package, start_time, end_time, status)")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });

    setAssignments((assignments as Assignment[]) ?? []);
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveProfile = async () => {
    if (!employee) return;
    setSaving(true);
    await supabase.from("employees").update({ phone: editPhone || null }).eq("id", employee.id);
    setEmployee({ ...employee, phone: editPhone });
    setEditing(false);
    setSaving(false);
  };

  const submitHours = async (assignmentId: string) => {
    const hours = parseFloat(hourInputs[assignmentId]);
    if (!hours || hours <= 0) return;
    setSaving(true);
    await supabase.from("booking_assignments").update({ hours_worked: hours }).eq("id", assignmentId);
    await fetchData();
    setSaving(false);
  };

  if (!employee) {
    return <div className="text-center py-20 text-[#6B6B6B]">Laster...</div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = assignments.filter((a) => a.bookings && a.bookings.date >= today && a.bookings.status !== "cancelled");
  const past = assignments.filter((a) => a.bookings && (a.bookings.date < today || a.bookings.status === "completed"));
  const totalHours = assignments.filter((a) => a.approved).reduce((s, a) => s + (a.hours_worked ?? 0), 0);
  const pendingHours = assignments.filter((a) => a.hours_worked && !a.approved).reduce((s, a) => s + (a.hours_worked ?? 0), 0);

  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };

  return (
    <div>
      {/* Profile card */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{employee.name}</h1>
            <p className="text-[11px] text-[#C9A84C] tracking-wider uppercase">{employee.role}</p>
          </div>
          <button onClick={() => setEditing(!editing)}
            className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer">
            {editing ? "Avbryt" : "Rediger profil"}
          </button>
        </div>

        {editing ? (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Telefon</label>
              <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                className="w-full mt-1 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
              Lagre
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">E-post</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Telefon</p>
              <p>{employee.phone || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Timelønn</p>
              <p>{employee.hourly_rate} kr/t</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Kommende oppdrag</p>
          <p className="text-2xl font-semibold text-[#C9A84C]">{upcoming.length}</p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Godkjente timer</p>
          <p className="text-2xl font-semibold text-green-400">{totalHours} t</p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] p-5">
          <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Venter godkjenning</p>
          <p className="text-2xl font-semibold text-yellow-400">{pendingHours} t</p>
        </div>
      </div>

      {/* Upcoming assignments */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6 mb-8">
        <h2 className="text-sm font-medium mb-4">Kommende oppdrag</h2>
        {upcoming.length === 0 ? (
          <p className="text-[#6B6B6B] text-sm">Ingen kommende oppdrag</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-[#1E1E1E] last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.bookings?.customer_name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    {a.bookings?.date ? new Date(a.bookings.date + "T00:00:00").toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" }) : ""}
                    {a.bookings?.start_time && ` · ${a.bookings.start_time} – ${a.bookings.end_time}`}
                  </p>
                </div>
                <span className="text-[11px] text-[#C9A84C]">{packageLabels[a.bookings?.package ?? ""]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past assignments — register hours */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6">
        <h2 className="text-sm font-medium mb-4">Registrer timer</h2>
        {past.length === 0 ? (
          <p className="text-[#6B6B6B] text-sm">Ingen tidligere oppdrag</p>
        ) : (
          <div className="space-y-3">
            {past.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-[#1E1E1E] last:border-0">
                <div>
                  <p className="text-sm">{a.bookings?.customer_name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    {a.bookings?.date ? new Date(a.bookings.date + "T00:00:00").toLocaleDateString("no-NO", { day: "numeric", month: "short" }) : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {a.hours_worked ? (
                    <div className="text-right">
                      <p className="text-sm">{a.hours_worked} t</p>
                      <p className={`text-[10px] ${a.approved ? "text-green-400" : "text-yellow-400"}`}>
                        {a.approved ? "Godkjent" : "Venter"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        value={hourInputs[a.id] ?? ""}
                        onChange={(e) => setHourInputs({ ...hourInputs, [a.id]: e.target.value })}
                        placeholder="Timer"
                        className="w-20 bg-[#0A0A0A] border border-[#1E1E1E] px-2 py-1.5 text-sm outline-none focus:border-[#C9A84C]/40 text-center"
                      />
                      <button onClick={() => submitHours(a.id)} disabled={saving}
                        className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
