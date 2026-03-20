import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify admin
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServiceRoleClient();

  // Check is_owner
  const { data: admin } = await supabase
    .from("employees")
    .select("is_owner")
    .eq("email", user.email ?? "")
    .single();

  if (!admin || !(admin as { is_owner: boolean }).is_owner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, email, phone, role, hourly_rate, password } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Navn og e-post er påkrevd" }, { status: 400 });
  }

  let authUserId: string | null = null;

  // Create Supabase auth user if password provided
  if (password) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: "Kunne ikke opprette bruker: " + authError.message }, { status: 500 });
    }

    authUserId = authData.user?.id ?? null;
  }

  // Create employee record
  const { data: employee, error: empError } = await supabase
    .from("employees")
    .insert({
      name,
      email,
      phone: phone || null,
      role: role || "Bartender",
      hourly_rate: parseFloat(hourly_rate) || 0,
      is_active: false,
      auth_user_id: authUserId,
    })
    .select()
    .single();

  if (empError) {
    return NextResponse.json({ error: "Kunne ikke opprette ansatt: " + empError.message }, { status: 500 });
  }

  return NextResponse.json({ employee }, { status: 201 });
}
