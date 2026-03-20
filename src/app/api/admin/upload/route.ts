import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify admin
  const supabase = await createServiceRoleClient();
  const { data: admin } = await supabase.from("employees").select("is_owner").eq("email", user.email ?? "").single();
  if (!admin || !(admin as { is_owner: boolean }).is_owner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const employeeId = formData.get("employeeId") as string | null;

  if (!file || !employeeId) {
    return NextResponse.json({ error: "Missing file or employeeId" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Kun JPG, PNG eller WebP" }, { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Maks 5MB" }, { status: 400 });
  }

  const mimeToExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = mimeToExt[file.type] ?? "jpg";
  const filename = `employee-${employeeId}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "images", "employees");
  const filePath = path.join(uploadDir, filename);

  try {
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Update employee photo_url
    const photoUrl = `/images/employees/${filename}`;
    await supabase.from("employees").update({ photo_url: photoUrl }).eq("id", employeeId);

    return NextResponse.json({ url: photoUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Opplasting feilet" }, { status: 500 });
  }
}
