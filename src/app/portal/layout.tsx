"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
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

      // Check if user is an employee
      const { data: employee } = await supabase
        .from("employees")
        .select("name")
        .eq("auth_user_id", user.id)
        .single();

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
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <html lang="no">
        <body className="bg-[#0A0A0A] text-[#F5F0E8] font-sans antialiased">
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-[#6B6B6B] text-sm">Laster...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="no">
      <body className="bg-[#0A0A0A] text-[#F5F0E8] font-sans antialiased">
        {/* Top bar */}
        <header className="border-b border-[#1E1E1E] bg-[#111]">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/portal" className="text-lg tracking-[0.15em] uppercase font-semibold">
              BarPro <span className="text-[#C9A84C] text-xs font-normal ml-1">Portal</span>
            </Link>
            <div className="flex items-center gap-6">
              {userName && <span className="text-sm text-[#6B6B6B]">{userName}</span>}
              <button onClick={handleLogout} className="text-sm text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors cursor-pointer">
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
