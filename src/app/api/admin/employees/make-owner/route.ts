import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServiceRoleClient();

  // Verify requester is owner
  const { data: admin } = await supabase.from("employees").select("is_owner").eq("email", user.email ?? "").single();
  if (!admin || !(admin as { is_owner: boolean }).is_owner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email } = await request.json();
  const { error } = await supabase.from("employees").update({ is_owner: true, is_active: true }).eq("email", email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
