"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ButtonSpinner } from "@/components/ui/Skeleton";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // New admin
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const notify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
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

  const addAdmin = async () => {
    if (!adminName || !adminEmail || !adminPassword) { notify("error", "Alle felt er påkrevd"); return; }
    if (adminPassword.length < 6) { notify("error", "Passord må være minst 6 tegn"); return; }
    setSaving(true);

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: "Admin",
          hourly_rate: "0",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        notify("error", data.error || "Kunne ikke opprette admin");
        setSaving(false);
        return;
      }

      // Mark as owner via separate update
      const serviceRes = await fetch("/api/admin/employees/make-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });

      if (!serviceRes.ok) {
        notify("error", "Bruker opprettet, men kunne ikke sette som admin. Gjør det manuelt i Ansatte.");
      } else {
        notify("success", `Admin-konto opprettet for ${adminEmail}`);
      }

      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
    } catch {
      notify("error", "Noe gikk galt");
    }
    setSaving(false);
  };

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 border text-sm ${
          notification.type === "success" ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"
        }`}>{notification.message}</div>
      )}

      <h1 className="text-2xl font-semibold mb-8">Innstillinger</h1>

      <div className="max-w-lg space-y-8">
        {/* Change password */}
        <div className="bg-[#1A1410] border border-[#1A1410] p-6">
          <h2 className="text-sm font-medium mb-4">Endre passord</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Nytt passord</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minst 6 tegn"
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40 placeholder:text-[#6B5D52]/40" />
            </div>
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Bekreft passord</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40" />
            </div>
            <button onClick={changePassword} disabled={saving || !newPassword}
              className="bg-[#C4907A]/10 text-[#C4907A] border border-[#C4907A]/30 px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#C4907A]/20 cursor-pointer disabled:opacity-50">
              {saving ? <span className="flex items-center gap-1.5"><ButtonSpinner />Lagrer...</span> : "Endre passord"}
            </button>
          </div>
        </div>

        {/* Add admin */}
        <div className="bg-[#1A1410] border border-[#1A1410] p-6">
          <h2 className="text-sm font-medium mb-4">Legg til ny admin</h2>
          <p className="text-[11px] text-[#6B5D52] mb-4">Opprett en ny bruker med admin-tilgang til panelet.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Navn</label>
              <input value={adminName} onChange={(e) => setAdminName(e.target.value)}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40" />
            </div>
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">E-post</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40" />
            </div>
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Passord</label>
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Minst 6 tegn"
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40 placeholder:text-[#6B5D52]/40" />
            </div>
            <button onClick={addAdmin} disabled={saving || !adminName || !adminEmail || !adminPassword}
              className="bg-[#C4907A] text-[#0D0A08] px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#D4A08A] cursor-pointer disabled:opacity-50">
              {saving ? <span className="flex items-center gap-1.5"><ButtonSpinner />Oppretter...</span> : "Opprett admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
