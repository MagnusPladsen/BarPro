import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createServiceRoleClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { title, slug, content, excerpt, status, published_at } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Tittel, slug og innhold er påkrevd" }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("blog_posts").insert({
    title, slug, content, excerpt,
    status: status || "draft",
    published_at: status === "published" ? published_at || new Date().toISOString() : null,
  });

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Denne URL-sluggen finnes allerede" }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { id, title, slug, content, excerpt, status, published_at } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("blog_posts").update({
    title, slug, content, excerpt, status,
    published_at: status === "published" ? published_at || new Date().toISOString() : null,
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await createServiceRoleClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
