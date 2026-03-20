import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Verify the current user is an authenticated owner/admin.
 * Returns the user object if valid, null if not.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const serviceClient = await createServiceRoleClient();
  const { data: employee } = await serviceClient
    .from("employees")
    .select("is_owner")
    .eq("email", user.email ?? "")
    .single();

  if (!employee || !(employee as { is_owner: boolean }).is_owner) return null;
  return user;
}
