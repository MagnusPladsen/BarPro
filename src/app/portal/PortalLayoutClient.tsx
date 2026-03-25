"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css";

export default function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }

      let { data: employee } = await supabase
        .from("employees")
        .select("name")
        .eq("auth_user_id", user.id)
        .single();

      if (!employee) {
        const { data: empByEmail } = await supabase
          .from("employees")
          .select("name")
          .eq("email", user.email ?? "")
          .single();
        employee = empByEmail;
      }

      if (employee) {
        setUserName((employee as { name: string }).name);
      } else {
        setUserName(user.email ?? null);
      }
      setLoading(false);
    });
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <html lang="no">
        <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased">
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-[#6B5D52] text-sm">Laster...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="no">
      <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased">
        <header className="border-b border-[#1A1410] bg-[#120E0B]">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/portal" className="text-lg tracking-[0.15em] uppercase font-semibold">
              BarPro <span className="text-[#C4907A] text-xs font-normal ml-1">Portal</span>
            </Link>
            <div className="flex items-center gap-6">
              {userName && <span className="text-sm text-[#6B5D52]">{userName}</span>}
              <Link href="/portal/hjelp" className="text-sm text-[#6B5D52] hover:text-[#C4907A] transition-colors">
                Hjelp
              </Link>
              <button onClick={handleLogout} className="text-sm text-[#6B5D52] hover:text-[#E8DDD4] transition-colors cursor-pointer">
                Logg ut
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
