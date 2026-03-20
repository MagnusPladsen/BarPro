import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createServiceRoleClient();

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "E-post er påkrevd" }, { status: 400 });

  // Verify target employee exists and is not already an owner
  const { data: target } = await supabase.from("employees").select("id, is_owner").eq("email", email).single();
  if (!target) return NextResponse.json({ error: "Ansatt ikke funnet" }, { status: 404 });
  if ((target as { is_owner: boolean }).is_owner) return NextResponse.json({ error: "Allerede admin" }, { status: 400 });

  const { error } = await supabase.from("employees").update({ is_owner: true, is_active: true }).eq("email", email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
