import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: fetch blocked dates and bookings for a month
export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end" }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();

  const [blockedRes, bookingsRes] = await Promise.all([
    supabase.from("blocked_dates").select("*").gte("date", start).lte("date", end),
    supabase.from("bookings").select("*").gte("date", start).lte("date", end).in("status", ["pending", "offer_sent", "confirmed", "completed"]),
  ]);

  // Only fetch assignments for bookings in this month
  const bookingIds = ((bookingsRes.data ?? []) as { id: string }[]).map((b) => b.id);
  const assignmentsRes = bookingIds.length > 0
    ? await supabase.from("booking_assignments").select("*, employees(name, role)").in("booking_id", bookingIds)
    : { data: [] };

  return NextResponse.json({
    blockedDates: blockedRes.data ?? [],
    bookings: bookingsRes.data ?? [],
    assignments: assignmentsRes.data ?? [],
  });
}

// POST: block a date
export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, reason } = await request.json();
  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("blocked_dates").insert({ date, reason: reason || null });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE: unblock a date
export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
