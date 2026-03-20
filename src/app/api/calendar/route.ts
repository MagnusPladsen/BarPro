import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Public API: returns only dates that are blocked or booked (no personal data)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end" }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();

  const [blockedRes, bookingsRes] = await Promise.all([
    supabase
      .from("blocked_dates")
      .select("date")
      .gte("date", start)
      .lte("date", end),
    supabase
      .from("bookings")
      .select("date")
      .gte("date", start)
      .lte("date", end)
      .in("status", ["pending", "confirmed"]),
  ]);

  return NextResponse.json({
    blockedDates: (blockedRes.data ?? []).map((d: { date: string }) => d.date),
    bookedDates: (bookingsRes.data ?? []).map((d: { date: string }) => d.date),
  });
}
