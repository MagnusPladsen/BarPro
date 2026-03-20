import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = await createServiceRoleClient();
  let query = supabase
    .from("time_entries")
    .select("*, employees(name, role, hourly_rate)")
    .order("date", { ascending: false });

  if (status && status !== "all" && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status as "pending" | "approved" | "rejected");
  }

  const { data } = await query;
  return NextResponse.json({ entries: data ?? [] });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ids, status } = await request.json();
  const supabase = await createServiceRoleClient();

  if (ids && Array.isArray(ids)) {
    // Bulk update
    for (const entryId of ids) {
      await supabase.from("time_entries").update({ status, approved_at: new Date().toISOString() }).eq("id", entryId);
    }
  } else if (id) {
    await supabase.from("time_entries").update({ status, approved_at: new Date().toISOString() }).eq("id", id);
  }

  return NextResponse.json({ success: true });
}
