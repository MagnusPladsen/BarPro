"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/kalender", label: "Kalender", icon: "calendar" },
  { href: "/admin/bookinger", label: "Bookinger", icon: "clipboard" },
  { href: "/admin/meldinger", label: "Meldinger", icon: "mail" },
  { href: "/admin/ansatte", label: "Ansatte", icon: "users" },
  { href: "/admin/timer", label: "Timer", icon: "clock" },
  { href: "/admin/rapporter", label: "Rapporter", icon: "chart" },
];

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "clipboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M9 2h6v3H9zM9 10h6M9 14h4" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <circle cx="9" cy="7" r="4" />
          <path d="M1 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
          <circle cx="19" cy="7" r="3" />
          <path d="M19 14a4 4 0 0 1 4 4v1" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-6 4 4 5-8" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, [supabase.auth]);

  // Don't wrap login page in admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <html lang="no">
      <body className="bg-[#0A0A0A] text-[#F5F0E8] font-sans antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#111] border-r border-[#1E1E1E] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-[#1E1E1E]">
              <Link href="/admin" className="text-lg tracking-[0.15em] uppercase font-semibold">
                BarPro <span className="text-[#C9A84C] text-xs font-normal ml-1">Admin</span>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-[#C9A84C] bg-[#C9A84C]/10"
                        : "text-[#6B6B6B] hover:text-[#F5F0E8] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <NavIcon icon={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-[#1E1E1E]">
              {userEmail && (
                <p className="text-[10px] text-[#6B6B6B] truncate mb-3">{userEmail}</p>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-[#6B6B6B] hover:text-[#F5F0E8] transition-colors duration-200 cursor-pointer"
              >
                Logg ut
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
