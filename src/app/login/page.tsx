"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../globals.css";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Feil e-post eller passord");
      setLoading(false);
      return;
    }

    // Check if user is an owner (admin) or employee
    const { data: employee } = await supabase
      .from("employees")
      .select("is_owner")
      .eq("email", email)
      .single();

    if (employee && (employee as { is_owner: boolean }).is_owner) {
      router.push("/admin");
    } else {
      router.push("/portal");
    }
    router.refresh();
  };

  return (
    <html lang="no">
      <body className="bg-[#0A0A0A] text-[#F5F0E8] font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-12">
              <h1 className="text-2xl tracking-[0.15em] uppercase font-semibold mb-2">
                Bar<span className="text-[#C9A84C]">Pro</span>
              </h1>
              <p className="text-[#6B6B6B] text-sm">Logg inn for ansatte og admin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                  E-post
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#1E1E1E] px-4 py-3 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]/40 transition-colors duration-300 placeholder:text-[#6B6B6B]/50"
                  placeholder="din@epost.no"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                  Passord
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#1E1E1E] px-4 py-3 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]/40 transition-colors duration-300 placeholder:text-[#6B6B6B]/50"
                  placeholder="Passord"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9A84C] text-[#0A0A0A] py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#D4AF57] transition-colors duration-300 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Logger inn..." : "Logg inn"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <a href="/" className="text-[11px] text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors">
                &larr; Tilbake til nettsiden
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
