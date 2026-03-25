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
  { href: "/admin/aktivitet", label: "Aktivitet", icon: "activity" },
  { href: "/admin/blogg", label: "Blogg", icon: "pen" },
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
    case "activity":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "pen":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
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

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    setLightMode(localStorage.getItem("admin-theme") === "light");
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });

    // Fetch badge counts
    Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["pending", "offer_sent"]),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
      supabase.from("time_entries").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]).then(([bookings, messages, timer]) => {
      setBadges({
        "/admin/bookinger": (bookings.count ?? 0),
        "/admin/meldinger": (messages.count ?? 0),
        "/admin/timer": (timer.count ?? 0),
      });
    });
  }, [supabase, supabase.auth]);

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
      <body className={`font-sans antialiased transition-colors duration-300 ${lightMode ? "bg-[#E8DDD4] text-[#2A211A]" : "bg-[#0D0A08] text-[#E8DDD4]"}`}>
        <div className="flex min-h-screen">
          {/* Mobile header */}
          <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#120E0B] border-b border-[#1A1410] flex items-center justify-between px-4 lg:hidden">
            <Link href="/admin" className="text-sm tracking-[0.15em] uppercase font-semibold">
              BarPro <span className="text-[#C4907A] text-xs font-normal ml-1">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#6B5D52] hover:text-[#E8DDD4] cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                {sidebarOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>

          {/* Sidebar overlay (mobile) */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`fixed top-0 left-0 bottom-0 w-64 border-r flex flex-col z-50 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${lightMode ? "bg-white border-gray-200" : "bg-[#120E0B] border-[#1A1410]"}`}>
            {/* Logo */}
            <div className="p-6 border-b border-[#1A1410]">
              <Link href="/admin" className="text-lg tracking-[0.15em] uppercase font-semibold">
                BarPro <span className="text-[#C4907A] text-xs font-normal ml-1">Admin</span>
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
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-[#C4907A] bg-[#C4907A]/10"
                        : "text-[#6B5D52] hover:text-[#E8DDD4] hover:bg-[#2A211A]"
                    }`}
                  >
                    <NavIcon icon={item.icon} />
                    <span className="flex-1">{item.label}</span>
                    {badges[item.href] > 0 && (
                      <span className="bg-[#C4907A] text-[#0D0A08] text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {badges[item.href]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-[#1A1410]">
              {userEmail && (
                <p className="text-[10px] text-[#6B5D52] truncate mb-3">{userEmail}</p>
              )}
              <div className="flex items-center justify-between mb-2">
                <Link href="/admin/hjelp" onClick={() => setSidebarOpen(false)}
                  className="text-sm text-[#6B5D52] hover:text-[#E8DDD4] transition-colors duration-200">
                  Hjelp
                </Link>
                <button onClick={() => {
                  const next = !lightMode;
                  setLightMode(next);
                  localStorage.setItem("admin-theme", next ? "light" : "dark");
                }} className="text-[#6B5D52] hover:text-[#C4907A] transition-colors cursor-pointer" title={lightMode ? "Mørk modus" : "Lys modus"}>
                  {lightMode ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                  )}
                </button>
              </div>
              <Link href="/admin/innstillinger" onClick={() => setSidebarOpen(false)}
                className="block text-sm text-[#6B5D52] hover:text-[#E8DDD4] transition-colors duration-200 mb-2">
                Innstillinger
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-[#6B5D52] hover:text-[#E8DDD4] transition-colors duration-200 cursor-pointer"
              >
                Logg ut
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-64 p-4 pt-18 lg:p-8 lg:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
