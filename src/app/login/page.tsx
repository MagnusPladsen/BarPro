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
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

            {forgotMode ? (
              <div className="space-y-6">
                {resetSent ? (
                  <div className="text-center">
                    <p className="text-green-400 text-sm mb-4">Tilbakestillingslenke sendt!</p>
                    <p className="text-[#6B6B6B] text-sm">Sjekk e-posten din for en lenke til å tilbakestille passordet.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="reset-email" className="block text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                        E-post
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#141414] border border-[#1E1E1E] px-4 py-3 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]/40 transition-colors duration-300 placeholder:text-[#6B6B6B]/50"
                        placeholder="din@epost.no"
                      />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                      onClick={async () => {
                        setError("");
                        setLoading(true);
                        const { error } = await supabase.auth.resetPasswordForEmail(email);
                        if (error) { setError("Kunne ikke sende tilbakestillingslenke"); }
                        else { setResetSent(true); }
                        setLoading(false);
                      }}
                      disabled={loading || !email}
                      className="w-full bg-[#C9A84C] text-[#0A0A0A] py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#D4AF57] transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? "Sender..." : "Send tilbakestillingslenke"}
                    </button>
                  </>
                )}
                <button onClick={() => { setForgotMode(false); setResetSent(false); setError(""); }}
                  className="w-full text-[11px] text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer">
                  &larr; Tilbake til innlogging
                </button>
              </div>
            ) : (
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
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#141414] border border-[#1E1E1E] px-4 py-3 pr-12 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]/40 transition-colors duration-300 placeholder:text-[#6B6B6B]/50"
                      placeholder="Passord"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
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

                <button type="button" onClick={() => { setForgotMode(true); setError(""); }}
                  className="w-full text-[11px] text-[#6B6B6B] hover:text-[#C9A84C] transition-colors cursor-pointer">
                  Glemt passord?
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
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
