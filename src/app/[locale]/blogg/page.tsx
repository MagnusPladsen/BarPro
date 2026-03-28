import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogPostList } from "./BlogPostList";
import { BookingCallout } from "@/components/sections/BookingCallout";

export default async function BloggPage() {
  const t = await getTranslations("blogPage");

  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, content, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <BlogPostList
        posts={posts ?? []}
        heroLabel={t("hero.label")}
        heroHeading={t("hero.heading")}
        emptyMessage={t.has("empty") ? t("empty") : "Ingen innlegg ennå."}
      />
      <BookingCallout />
    </>
  );
}
