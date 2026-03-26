"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { Database } from "@/lib/supabase/types";
import { EmployeeListItemSkeleton } from "@/components/ui/LoadingState";
import { ButtonSpinner } from "@/components/ui/Skeleton";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Assignment = Database["public"]["Tables"]["booking_assignments"]["Row"] & {
  bookings?: { date: string; customer_name: string; package: string; status: string } | null;
};

export default function AnsattePage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editing, setEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editActive, setEditActive] = useState(false);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Bartender");
  const [newRate, setNewRate] = useState("275");
  const [newPassword, setNewPassword] = useState("");

  const fetchEmployees = useCallback(async () => {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("is_owner", { ascending: false })
      .order("is_active", { ascending: false })
      .order("name");

    setEmployees((data as Employee[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const selectEmployee = async (emp: Employee) => {
    setSelected(emp);
    setEditing(false);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone ?? "");
    setEditRole(emp.role);
    setEditRate(String(emp.hourly_rate));
    setEditActive(emp.is_active);

    // Fetch assignments with booking info
    const { data } = await supabase
      .from("booking_assignments")
      .select("*, bookings(date, customer_name, package, status)")
      .eq("employee_id", emp.id)
      .order("created_at", { ascending: false })
      .limit(20);

    setAssignments((data as Assignment[]) ?? []);
  };

  const saveEmployee = async () => {
    if (!selected) return;
    setSaving(true);

    await supabase.from("employees").update({
      name: editName,
      email: editEmail,
      phone: editPhone || null,
      role: editRole,
      hourly_rate: parseFloat(editRate) || 0,
      is_active: editActive,
    }).eq("id", selected.id);

    await fetchEmployees();
    setSelected({ ...selected, name: editName, email: editEmail, phone: editPhone, role: editRole, hourly_rate: parseFloat(editRate) || 0, is_active: editActive });
    setEditing(false);
    setSaving(false);
  };

  const [addError, setAddError] = useState("");

  const addEmployee = async () => {
    if (!newName || !newEmail) return;
    setSaving(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
          hourly_rate: newRate,
          password: newPassword || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Kunne ikke opprette ansatt");
        setSaving(false);
        return;
      }

      setShowAddForm(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewRole("Bartender");
      setNewRate("275");
      setNewPassword("");
      await fetchEmployees();
    } catch {
      setAddError("Noe gikk galt");
    }
    setSaving(false);
  };

  const totalHours = assignments.reduce((sum, a) => sum + (a.hours_worked ?? 0), 0);
  const approvedHours = assignments.filter((a) => a.approved).reduce((sum, a) => sum + (a.hours_worked ?? 0), 0);

  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [page, setPage] = useState(0);
  const [empSearch, setEmpSearch] = useState("");
  const [empSort, setEmpSort] = useState<"name" | "hourly_rate">("name");
  const [empSortDir, setEmpSortDir] = useState<"asc" | "desc">("asc");
  const PAGE_SIZE = 10;

  const filtered = (filter === "all" ? employees : employees.filter((e) => filter === "active" ? e.is_active : !e.is_active))
    .filter((e) => empSearch.length < 2 || e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.email.toLowerCase().includes(empSearch.toLowerCase()))
    .sort((a, b) => {
      const val = empSort === "name" ? a.name.localeCompare(b.name) : a.hourly_rate - b.hourly_rate;
      return empSortDir === "asc" ? val : -val;
    });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const filters: { value: "active" | "inactive" | "all"; label: string }[] = [
    { value: "active", label: "Aktive" },
    { value: "inactive", label: "Inaktive" },
    { value: "all", label: "Alle" },
  ];

  return (
    <div>
      {/* Toast notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 border text-sm animate-[fadeIn_0.3s] ${
          notification.type === "success"
            ? "bg-green-400/10 border-green-400/30 text-green-400"
            : "bg-red-400/10 border-red-400/30 text-red-400"
        }`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-8">Ansatte</h1>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button key={f.value} onClick={() => { setFilter(f.value); setPage(0); }}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30"
                : "text-[#6B6B6B] border border-[#141414] hover:text-[#F5F0E8]"
            }`}>{f.label} ({filter === "all" ? employees.length : employees.filter((e) => f.value === "active" ? e.is_active : f.value === "inactive" ? !e.is_active : true).length})</button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input value={empSearch} onChange={(e) => { setEmpSearch(e.target.value); setPage(0); }}
          placeholder="Søk etter ansatt..."
          className="flex-1 bg-[#141414] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
        <select value={empSort} onChange={(e) => setEmpSort(e.target.value as "name" | "hourly_rate")}
          className="bg-[#141414] border border-[#141414] px-3 py-2 text-xs text-[#6B6B6B] cursor-pointer">
          <option value="name">Navn</option>
          <option value="hourly_rate">Timelønn</option>
        </select>
        <button onClick={() => setEmpSortDir(empSortDir === "asc" ? "desc" : "asc")}
          className="border border-[#141414] px-3 py-2 text-xs text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer">
          {empSortDir === "asc" ? "↑ A-Å" : "↓ Å-A"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Employee list */}
        <div className={`${selected ? "w-1/2" : "w-full"} space-y-2`}>
          {loading ? (
            <>
              <EmployeeListItemSkeleton />
              <EmployeeListItemSkeleton />
              <EmployeeListItemSkeleton />
              <EmployeeListItemSkeleton />
            </>
          ) : (
            <>
              {displayed.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => selectEmployee(emp)}
                  className={`w-full text-left flex items-center gap-4 bg-[#141414] border p-4 transition-colors cursor-pointer ${
                    selected?.id === emp.id
                      ? "border-[#C9A84C]/40"
                      : "border-[#141414] hover:border-[#C9A84C]/20"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-[#141414] overflow-hidden shrink-0 relative">
                    {emp.photo_url ? (
                      <Image src={emp.photo_url} alt={emp.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-sm font-medium">
                        {emp.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{emp.name}</p>
                      {emp.is_owner && (
                        <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C]">
                          Eier
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B6B6B]">{emp.role}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#6B6B6B]">{emp.hourly_rate} kr/t</span>
                    <div className={`w-2 h-2 ${emp.is_active ? "bg-green-400" : "bg-[#6B6B6B]/30"}`} />
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="px-3 py-1.5 text-xs text-[#6B6B6B] border border-[#141414] hover:text-[#F5F0E8] cursor-pointer disabled:opacity-30">&larr;</button>
              <span className="text-[11px] text-[#6B6B6B]">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs text-[#6B6B6B] border border-[#141414] hover:text-[#F5F0E8] cursor-pointer disabled:opacity-30">&rarr;</button>
            </div>
          )}

          {/* Add employee button */}
          <button onClick={() => setShowAddForm(true)}
            className="w-full mt-4 border border-dashed border-[#141414] py-4 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-colors cursor-pointer">
            + Legg til ansatt
          </button>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-1/2 bg-[#141414] border border-[#141414] p-6 sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <label className="w-16 h-16 bg-[#1A1A1A] border border-[#141414] overflow-hidden relative shrink-0 cursor-pointer group">
                  {selected.photo_url ? (
                    <Image src={selected.photo_url} alt={selected.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-lg font-medium">
                      {selected.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !selected) return;
                    setSaving(true);
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("employeeId", selected.id);
                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                    if (res.ok) {
                      const { url } = await res.json();
                      setSelected({ ...selected, photo_url: url });
                      setNotification({ type: "success", message: "Bilde oppdatert" }); setTimeout(() => setNotification(null), 4000);
                      await fetchEmployees();
                    } else {
                      const data = await res.json();
                      setNotification({ type: "error", message: data.error || "Opplasting feilet" }); setTimeout(() => setNotification(null), 4000);
                    }
                    setSaving(false);
                  }} />
                </label>
                <div>
                  <h2 className="text-lg font-medium">{selected.name}</h2>
                  <p className="text-[11px] text-[#C9A84C]">{selected.role}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#6B6B6B] hover:text-[#F5F0E8] cursor-pointer">&times;</button>
            </div>

            {editing ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Navn</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">E-post</label>
                  <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Telefon</label>
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Rolle</label>
                  <input value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Timelønn (kr)</label>
                  <input type="number" value={editRate} onChange={(e) => setEditRate(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="accent-[#C9A84C]" />
                  <span className="text-sm">Aktiv</span>
                </label>
                <div className="flex gap-2 pt-2">
                  <button onClick={saveEmployee} disabled={saving} className="flex-1 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer disabled:opacity-50">
                    Lagre
                  </button>
                  <button onClick={() => setEditing(false)} className="flex-1 border border-[#141414] py-2 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] cursor-pointer">
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">E-post</p>
                    <a href={`mailto:${selected.email}`} className="text-[#C9A84C] hover:underline text-sm">{selected.email}</a>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Telefon</p>
                    <p>{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Timelønn</p>
                    <p>{selected.hourly_rate} kr/t</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Status</p>
                    <p className={selected.is_active ? "text-green-400" : "text-[#6B6B6B]"}>
                      {selected.is_active ? "Aktiv" : "Inaktiv"}
                    </p>
                  </div>
                </div>

                {/* Hours summary */}
                <div className="border-t border-[#141414] pt-4">
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-3">Timer</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0A0A0A] border border-[#141414] p-3">
                      <p className="text-2xl font-semibold">{totalHours}</p>
                      <p className="text-[10px] text-[#6B6B6B]">Totalt registrert</p>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#141414] p-3">
                      <p className="text-2xl font-semibold text-green-400">{approvedHours}</p>
                      <p className="text-[10px] text-[#6B6B6B]">Godkjent</p>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                {assignments.length > 0 && (
                  <div className="border-t border-[#141414] pt-4">
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-3">Oppdrag</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {assignments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-2 border-b border-[#141414] last:border-0 text-[11px]">
                          <div>
                            <p className="text-[#F5F0E8]">{a.bookings?.customer_name ?? "Ukjent"}</p>
                            <p className="text-[#6B6B6B]">
                              {a.bookings?.date ? new Date(a.bookings.date + "T00:00:00").toLocaleDateString("no-NO", { day: "numeric", month: "short" }) : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p>{a.hours_worked ?? "—"} t</p>
                              <p className={a.approved ? "text-green-400" : "text-yellow-400"}>
                                {a.approved ? "Godkjent" : "Venter"}
                              </p>
                            </div>
                            {a.hours_worked && !a.approved && (
                              <button
                                onClick={async () => {
                                  await supabase.from("booking_assignments").update({ approved: true }).eq("id", a.id);
                                  if (selected) selectEmployee(selected);
                                }}
                                className="text-[9px] bg-green-400/10 text-green-400 border border-green-400/30 px-2 py-1 hover:bg-green-400/20 cursor-pointer"
                              >
                                Godkjenn
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 py-2 text-xs uppercase tracking-wider hover:bg-[#C9A84C]/20 cursor-pointer"
                  >
                    Rediger
                  </button>
                  <button
                    onClick={async () => {
                      const { error } = await supabase.auth.resetPasswordForEmail(selected.email, {
                        redirectTo: `${window.location.origin}/login`,
                      });
                      if (error) {
                        setNotification({ type: "error", message: "Kunne ikke sende reset-lenke: " + error.message });
                      } else {
                        setNotification({ type: "success", message: "Passord-reset sendt til " + selected.email });
                      }
                      setTimeout(() => setNotification(null), 5000);
                    }}
                    className="flex-1 border border-[#141414] text-[#6B6B6B] py-2 text-xs uppercase tracking-wider hover:text-[#F5F0E8] hover:border-[#C9A84C]/20 cursor-pointer"
                  >
                    Reset passord
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add employee modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAddForm(false)}>
          <div className="bg-[#141414] border border-[#141414] p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-medium mb-6">Legg til ansatt</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Navn *</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">E-post *</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Telefon</label>
                <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Rolle</label>
                <input value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Timelønn (kr)</label>
                <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40" />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Passord (for innlogging)</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="La tom for å opprette uten innlogging" className="w-full mt-1 bg-[#0A0A0A] border border-[#141414] px-3 py-2 text-sm outline-none focus:border-[#C9A84C]/40 placeholder:text-[#6B6B6B]/40" />
              </div>
              {addError && <p className="text-red-400 text-sm">{addError}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={addEmployee}
                  disabled={saving || !newName || !newEmail}
                  className="flex-1 bg-[#C9A84C] text-[#0A0A0A] py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#D4AF57] cursor-pointer disabled:opacity-50"
                >
                  {saving ? <span className="flex items-center justify-center gap-1.5"><ButtonSpinner />Lagrer...</span> : "Legg til"}
                </button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 border border-[#141414] py-2 text-xs text-[#6B6B6B] uppercase tracking-wider hover:text-[#F5F0E8] cursor-pointer">
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
