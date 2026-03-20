import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

// Generate an .ics calendar file with all confirmed bookings
export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createServiceRoleClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .in("status", ["confirmed", "offer_sent"])
    .order("date");

  if (!bookings) return NextResponse.json({ error: "No data" }, { status: 500 });

  const events = (bookings as {
    id: string;
    date: string;
    customer_name: string;
    package: string;
    guest_count: string;
    event_type: string;
    start_time: string | null;
    end_time: string | null;
    customer_phone: string | null;
    customer_email: string;
    status: string;
  }[]).map((b) => {
    const dateClean = b.date.replace(/-/g, "");
    const startTime = b.start_time ? b.start_time.replace(/:/g, "") + "00" : "180000";
    const endTime = b.end_time ? b.end_time.replace(/:/g, "") + "00" : "230000";
    const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };

    return [
      "BEGIN:VEVENT",
      `UID:${b.id}@barpro`,
      `DTSTART:${dateClean}T${startTime}`,
      `DTEND:${dateClean}T${endTime}`,
      `SUMMARY:BarPro: ${b.customer_name} (${packageLabels[b.package] ?? b.package})`,
      `DESCRIPTION:Type: ${b.event_type}\\nGjester: ${b.guest_count}\\nTelefon: ${b.customer_phone ?? "—"}\\nE-post: ${b.customer_email}\\nStatus: ${b.status}`,
      `LOCATION:`,
      "END:VEVENT",
    ].join("\r\n");
  });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BarPro//Bookings//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:BarPro Bookinger",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=barpro-bookinger.ics",
    },
  });
}
