"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"] & {
  bookings?: { date: string; customer_name: string; package: string; start_time: string | null; end_time: string | null; status: string } | null;
};
type TimeEntry = Database["public"]["Tables"]["time_entries"]["Row"];

type Tab = "oversikt" | "kalender" | "timer" | "profil";

export default function PortalPage() {
  const supabase = createClient();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [blockedDates, setBlockedDates] = useState<{ id: string; date: string; reason: string | null }[]>([]);
  const [tab, setTab] = useState<Tab>("oversikt");
  const [calMonth, setCalMonth] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Hour registration form
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [logStart, setLogStart] = useState("18:00");
  const [logEnd, setLogEnd] = useState("23:00");
  const [logDesc, setLogDesc] = useState("");

  // Block date modal
  const [blockModal, setBlockModal] = useState<{ dateStr: string; existing: { id: string; reason: string | null } | null } | null>(null);
  const [blockReason, setBlockReason] = useState("");

  // Auto-calc hours from time range
  const calcLogHours = (): number => {
    const [sh, sm] = logStart.split(":").map(Number);
    const [eh, em] = logEnd.split(":").map(Number);
    let start = sh + sm / 60;
    let end = eh + em / 60;
    if (end <= start) end += 24;
    return Math.round((end - start) * 100) / 100;
  };

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile edit
  const [editPhone, setEditPhone] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);

  const notify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Find employee by auth_user_id or email
    let { data: emp } = await supabase.from("employees").select("*").eq("auth_user_id", user.id).single();
    if (!emp) {
      const { data: empByEmail } = await supabase.from("employees").select("*").eq("email", user.email ?? "").single();
      emp = empByEmail;
    }
    if (!emp) { router.push("/login"); return; }

    const employee = emp as Employee;
    setEmployee(employee);
    setEditPhone(employee.phone ?? "");

    // Fetch assignments
    const { data: assignments } = await supabase
      .from("booking_assignments")
      .select("*, bookings(date, customer_name, package, start_time, end_time, status)")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setAssignments((assignments as Assignment[]) ?? []);

    // Fetch time entries
    const { data: entries } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employee.id)
      .order("date", { ascending: false });
    setTimeEntries((entries as TimeEntry[]) ?? []);

    // Fetch blocked dates
    const { data: blocked } = await supabase
      .from("employee_blocked_dates")
      .select("id, date, reason")
      .eq("employee_id", employee.id);
    setBlockedDates((blocked as { id: string; date: string; reason: string | null }[]) ?? []);
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const submitHours = async () => {
    const hours = calcLogHours();
    if (!employee || hours <= 0) return;
    setSaving(true);
    const { error } = await supabase.from("time_entries").insert({
      employee_id: employee.id,
      date: logDate,
      hours,
      start_time: logStart || null,
      end_time: logEnd || null,
      description: logDesc || null,
    });
    if (error) {
      notify("error", "Kunne ikke registrere timer");
    } else {
      notify("success", `${hours} timer registrert`);
      setLogDesc("");
      await fetchData();
    }
    setSaving(false);
  };

  const openBlockModal = (dateStr: string) => {
    const existing = blockedDates.find((d) => d.date === dateStr) ?? null;
    setBlockReason(existing?.reason ?? "");
    setBlockModal({ dateStr, existing });
  };

  const confirmBlock = async () => {
    if (!employee || !blockModal) return;
    setSaving(true);
    await supabase.from("employee_blocked_dates").insert({
      employee_id: employee.id,
      date: blockModal.dateStr,
      reason: blockReason || null,
    });
    setBlockModal(null);
    setBlockReason("");
    notify("success", "Dag markert som utilgjengelig");
    await fetchData();
    setSaving(false);
  };

  const confirmUnblock = async () => {
    if (!blockModal?.existing) return;
    setSaving(true);
    await supabase.from("employee_blocked_dates").delete().eq("id", blockModal.existing.id);
    setBlockModal(null);
    setBlockReason("");
    notify("success", "Dag er nå tilgjengelig");
    await fetchData();
    setSaving(false);
  };

  const saveProfile = async () => {
    if (!employee) return;
    setSaving(true);
    await supabase.from("employees").update({ phone: editPhone || null }).eq("id", employee.id);
    setEmployee({ ...employee, phone: editPhone });
    setEditingProfile(false);
    notify("success", "Profil oppdatert");
    setSaving(false);
  };

  const changePassword = async () => {
    if (newPassword.length < 6) { notify("error", "Passord må være minst 6 tegn"); return; }
    if (newPassword !== confirmPassword) { notify("error", "Passordene stemmer ikke overens"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { notify("error", "Kunne ikke endre passord: " + error.message); }
    else {
      notify("success", "Passord endret");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  if (!employee) return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-[#141414] animate-pulse" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map((i) => <div key={i} className="h-24 bg-[#141414] animate-pulse" />)}
      </div>
      <div className="h-48 bg-[#141414] animate-pulse" />
    </div>
  );

  const today = new Date().toISOString().split("T")[0];
  const upcoming = assignments.filter((a) => a.bookings && a.bookings.date >= today && a.bookings.status !== "cancelled");
  const totalApproved = timeEntries.filter((e) => e.status === "approved").reduce((s, e) => s + e.hours, 0);
  const totalPending = timeEntries.filter((e) => e.status === "pending").reduce((s, e) => s + e.hours, 0);
  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };

  // Calendar data
  const calYear = calMonth.getFullYear();
  const calMo = calMonth.getMonth();
  const daysInMonth = new Date(calYear, calMo + 1, 0).getDate();
  const firstDay = (new Date(calYear, calMo, 1).getDay() + 6) % 7;
  const calDays: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const getDateStr = (d: number) => `${calYear}-${String(calMo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const monthNames = ["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"];

  const tabs: { key: Tab; label: string }[] = [
    { key: "oversikt", label: "Oversikt" },
    { key: "kalender", label: "Kalender" },
    { key: "timer", label: "Registrer timer" },
    { key: "profil", label: "Profil" },
  ];

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 border text-sm ${
          notification.type === "success" ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"
        }`}>{notification.message}</div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              tab === t.key ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30" : "text-[#6B6B6B] border border-[#141414] hover:text-[#F5F0E8]"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* OVERSIKT */}
      {tab === "oversikt" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#141414] border border-[#141414] p-5">
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Kommende</p>
              <p className="text-2xl font-semibold text-[#C9A84C]">{upcoming.length}</p>
            </div>
            <div className="bg-[#141414] border border-[#141414] p-5">
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Godkjente timer</p>
              <p className="text-2xl font-semibold text-green-400">{totalApproved} t</p>
            </div>
            <div className="bg-[#141414] border border-[#141414] p-5">
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Venter godkjenning</p>
              <p className="text-2xl font-semibold text-yellow-400">{totalPending} t</p>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-[#141414] border border-[#141414] p-6">
            <h2 className="text-sm font-medium mb-4">Kommende oppdrag</h2>
            {upcoming.length === 0 ? (
              <p className="text-[#6B6B6B] text-sm">Ingen kommende oppdrag</p>
            ) : upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-[#141414] last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.bookings?.customer_name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    {a.bookings?.date ? new Date(a.bookings.date + "T00:00:00").toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" }) : ""}
                    {a.bookings?.start_time && ` · ${a.bookings.start_time}–${a.bookings.end_time}`}
                  </p>
                </div>
                <span className="text-[11px] text-[#C9A84C]">{packageLabels[a.bookings?.package ?? ""]}</span>
              </div>
            ))}
          </div>

          {/* Recent time entries */}
          <div className="bg-[#141414] border border-[#141414] p-6">
            <h2 className="text-sm font-medium mb-4">Siste timeregistreringer</h2>
            {timeEntries.length === 0 ? (
              <p className="text-[#6B6B6B] text-sm">Ingen registrerte timer</p>
            ) : timeEntries.slice(0, 10).map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#141414] last:border-0 text-sm">
                <div>
                  <p>{new Date(e.date + "T00:00:00").toLocaleDateString("no-NO", { day: "numeric", month: "short" })}</p>
                  <p className="text-[10px] text-[#6B6B6B]">{e.description || "Ingen beskrivelse"}</p>
                </div>
                <div className="text-right">
                  <p>{e.hours} t</p>
                  <p className={`text-[10px] ${e.status === "approved" ? "text-green-400" : e.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
                    {e.status === "approved" ? "Godkjent" : e.status === "rejected" ? "Avvist" : "Venter"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KALENDER */}
      {tab === "kalender" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCalMonth(new Date(calYear, calMo - 1))} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer px-3 py-1">&larr;</button>
            <h2 className="text-lg font-medium">{monthNames[calMo]} {calYear}</h2>
            <button onClick={() => setCalMonth(new Date(calYear, calMo + 1))} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer px-3 py-1">&rarr;</button>
          </div>

          <p className="text-[11px] text-[#6B6B6B] mb-4">Klikk på en dag for å markere at du ikke er tilgjengelig</p>

          <div className="bg-[#141414] border border-[#141414]">
            <div className="grid grid-cols-7 border-b border-[#141414]">
              {["Man","Tir","Ons","Tor","Fre","Lør","Søn"].map((d) => (
                <div key={d} className="p-2 text-center text-[10px] tracking-wider uppercase text-[#6B6B6B]">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="p-2 min-h-[70px] border-b border-r border-[#141414]" />;
                const dateStr = getDateStr(day);
                const dayAssignments = assignments.filter((a) => a.bookings?.date === dateStr);
                const dayEntries = timeEntries.filter((e) => e.date === dateStr);
                const isBlocked = blockedDates.some((d) => d.date === dateStr);
                const isToday = dateStr === today;
                const isPast = dateStr < today;

                return (
                  <button
                    key={day}
                    onClick={() => !isPast && !dayAssignments.length && openBlockModal(dateStr)}
                    disabled={isPast || saving}
                    className={`p-2 min-h-[70px] border-b border-r border-[#141414] text-left transition-colors ${
                      isBlocked ? "bg-red-400/10" : isToday ? "bg-[#C9A84C]/[0.05]" : ""
                    } ${isPast ? "opacity-40" : "cursor-pointer hover:bg-[#1A1A1A]"}`}
                  >
                    <span className={`text-[11px] ${isToday ? "text-[#C9A84C] font-semibold" : isBlocked ? "text-red-400" : "text-[#6B6B6B]"}`}>{day}</span>
                    {isBlocked && <div className="mt-1 text-[9px] text-red-400">Ikke tilgjengelig</div>}
                    {dayAssignments.map((a) => (
                      <div key={a.id} className="mt-1 px-1 py-0.5 bg-[#C9A84C]/10 text-[9px] text-[#C9A84C] truncate">
                        {a.bookings?.start_time && `${a.bookings.start_time} `}{a.bookings?.customer_name}
                      </div>
                    ))}
                    {dayEntries.map((e) => (
                      <div key={e.id} className={`mt-1 px-1 py-0.5 text-[9px] truncate ${
                        e.status === "approved" ? "bg-green-400/10 text-green-400" : e.status === "rejected" ? "bg-red-400/10 text-red-400" : "bg-yellow-400/10 text-yellow-400"
                      }`}>
                        {e.hours}t {e.description && `· ${e.description}`}
                      </div>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-[10px] text-[#6B6B6B]">
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-red-400/20" /> Ikke tilgjengelig</div>
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-[#C9A84C]/20" /> Oppdrag</div>
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-green-400/20" /> Godkjent</div>
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-yellow-400/20" /> Venter</div>
          </div>

          {/* Block date modal */}
          {blockModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setBlockModal(null)}>
              <div className="bg-[#141414] border border-[#141414] w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">
                    {new Date(blockModal.dateStr + "T00:00:00").toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" })}
                  </h3>
                  <button onClick={() => setBlockModal(null)} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer">&times;</button>
                </div>

                {blockModal.existing ? (
                  <div className="space-y-4">
                    <div className="bg-red-400/10 border border-red-400/20 p-3">
                      <p className="text-sm text-red-400">Denne dagen er markert som utilgjengelig</p>
                      {blockModal.existing.reason && (
                        <p className="text-[11px] text-[#6B6B6B] mt-1">Grunn: {blockModal.existing.reason}</p>
                      )}
                    </div>
                    <button onClick={confirmUnblock} disabled={saving}
                      className="w-full border border-[#141414] py-2 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] cursor-pointer disabled:opacity-50">
                      Fjern markering
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] text-[#6B6B6B]">Marker denne dagen som utilgjengelig. Admin vil se dette når de planlegger oppdrag.</p>
                    <div>
                      <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Grunn *</label>
                      <input value={blockReason} onChange={(e) => setBlockReason(e.target.value)}
                        placeholder="F.eks. Ferie, Syk, Annet oppdrag"
                        className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
                    </div>
                    <button onClick={confirmBlock} disabled={saving || !blockReason.trim()}
                      className="w-full bg-red-400/10 text-red-400 border border-red-400/30 py-2 text-xs uppercase tracking-wider hover:bg-red-400/20 cursor-pointer disabled:opacity-50">
                      {saving ? "Lagrer..." : "Marker som utilgjengelig"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGISTRER TIMER */}
      {tab === "timer" && (
        <div className="max-w-lg">
          <div className="bg-[#141414] border border-[#141414] p-6 space-y-5">
            <h2 className="text-sm font-medium">Registrer timer</h2>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Dato</label>
              <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
                className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
            </div>

            {/* Time picker — same style as booking page */}
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-2 block">Tidspunkt</label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-[#6B6B6B] mb-1.5 block">Fra</label>
                  <input type="time" value={logStart} onChange={(e) => setLogStart(e.target.value)} step="900"
                    className="w-full bg-[#0A0A0A] border border-[#141414] px-4 py-3 text-lg text-center outline-none focus:border-[#C9A84C]/40" />
                </div>
                <span className="text-[#6B6B6B] text-lg pb-3">—</span>
                <div className="flex-1">
                  <label className="text-[10px] text-[#6B6B6B] mb-1.5 block">Til</label>
                  <input type="time" value={logEnd} onChange={(e) => setLogEnd(e.target.value)} step="900"
                    className="w-full bg-[#0A0A0A] border border-[#141414] px-4 py-3 text-lg text-center outline-none focus:border-[#C9A84C]/40" />
                </div>
              </div>
              {/* Auto-calculated hours */}
              <div className="mt-3 bg-[#C9A84C]/[0.06] border border-[#C9A84C]/20 px-4 py-3 text-center">
                <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Timer: </span>
                <span className="text-lg font-semibold text-[#C9A84C]">{calcLogHours()} t</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Beskrivelse</label>
              <input value={logDesc} onChange={(e) => setLogDesc(e.target.value)}
                placeholder="Hva jobbet du med?"
                className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
            </div>

            <button onClick={submitHours} disabled={saving || calcLogHours() <= 0}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#D4AF57] cursor-pointer disabled:opacity-50">
              {saving ? "Lagrer..." : `Registrer ${calcLogHours()} timer`}
            </button>
          </div>

          {/* Recent entries */}
          <div className="mt-6 bg-[#141414] border border-[#141414] p-6">
            <h2 className="text-sm font-medium mb-4">Dine registreringer</h2>
            {timeEntries.length === 0 ? (
              <p className="text-[#6B6B6B] text-sm">Ingen registreringer</p>
            ) : timeEntries.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#141414] last:border-0 text-sm">
                <div>
                  <p>{new Date(e.date + "T00:00:00").toLocaleDateString("no-NO", { weekday: "short", day: "numeric", month: "short" })}</p>
                  <p className="text-[10px] text-[#6B6B6B]">
                    {e.start_time && `${e.start_time}–${e.end_time} · `}{e.description || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{e.hours} t</p>
                  <p className={`text-[10px] ${e.status === "approved" ? "text-green-400" : e.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
                    {e.status === "approved" ? "Godkjent" : e.status === "rejected" ? "Avvist" : "Venter"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFIL */}
      {tab === "profil" && (
        <div className="max-w-lg space-y-6">
          {/* Info */}
          <div className="bg-[#141414] border border-[#141414] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{employee.name}</h2>
                <p className="text-[11px] text-[#C9A84C] tracking-wider uppercase">{employee.role}</p>
              </div>
              <button onClick={() => setEditingProfile(!editingProfile)}
                className="text-[11px] text-[#C9A84C] hover:underline cursor-pointer">
                {editingProfile ? "Avbryt" : "Rediger"}
              </button>
            </div>

            {editingProfile ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Telefon</label>
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <button onClick={saveProfile} disabled={saving}
                  className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
                  Lagre
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
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

          {/* Change password */}
          <div className="bg-[#141414] border border-[#141414] p-6">
            <h2 className="text-sm font-medium mb-4">Endre passord</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Nytt passord</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minst 6 tegn"
                  className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Bekreft passord</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <button onClick={changePassword} disabled={saving || !newPassword}
                className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
                {saving ? "Lagrer..." : "Endre passord"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
