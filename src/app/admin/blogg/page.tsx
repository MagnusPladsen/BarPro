"use client";

import { useEffect, useState, useCallback } from "react";
import { ButtonSpinner } from "@/components/ui/Skeleton";
import { ListItemSkeleton } from "@/components/ui/LoadingState";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminBloggPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit form
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editStatus, setEditStatus] = useState<"draft" | "published">("draft");

  const notify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts((data.posts as BlogPost[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/^-|-$/g, "");

  const startNew = () => {
    setSelected(null);
    setEditing(true);
    setEditTitle("");
    setEditSlug("");
    setEditContent("");
    setEditExcerpt("");
    setEditStatus("draft");
  };

  const startEdit = (post: BlogPost) => {
    setSelected(post);
    setEditing(true);
    setEditTitle(post.title);
    setEditSlug(post.slug);
    setEditContent(post.content);
    setEditExcerpt(post.excerpt ?? "");
    setEditStatus(post.status);
  };

  const savePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      notify("error", "Tittel og innhold er påkrevd");
      return;
    }
    setSaving(true);
    const slug = editSlug || slugify(editTitle);
    const body = {
      id: selected?.id,
      title: editTitle,
      slug,
      content: editContent,
      excerpt: editExcerpt || null,
      status: editStatus,
      published_at: editStatus === "published" ? new Date().toISOString() : null,
    };

    const res = await fetch("/api/admin/blog", {
      method: selected ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      notify("success", selected ? "Innlegg oppdatert" : "Innlegg opprettet");
      setEditing(false);
      setSelected(null);
      await fetchPosts();
    } else {
      const data = await res.json();
      notify("error", data.error || "Kunne ikke lagre");
    }
    setSaving(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Slett dette innlegget?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    notify("success", "Innlegg slettet");
    setSelected(null);
    setEditing(false);
    await fetchPosts();
  };

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 border text-sm ${
          notification.type === "success" ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"
        }`}>{notification.message}</div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Blogg</h1>
        <button onClick={startNew}
          className="bg-[#C4907A] text-[#0D0A08] px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#D4A08A] cursor-pointer">
          + Nytt innlegg
        </button>
      </div>

      {editing ? (
        /* Editor */
        <div className="max-w-3xl space-y-5">
          <div className="bg-[#1A1410] border border-[#1A1410] p-6 space-y-4">
            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Tittel</label>
              <input value={editTitle}
                onChange={(e) => { setEditTitle(e.target.value); if (!selected) setEditSlug(slugify(e.target.value)); }}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-lg font-medium outline-none focus:border-[#C4907A]/40"
                placeholder="Skriv tittel..." />
            </div>

            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">URL-slug</label>
              <div className="flex items-center mt-1">
                <span className="text-[#6B5D52] text-sm mr-1">/blogg/</span>
                <input value={editSlug} onChange={(e) => setEditSlug(slugify(e.target.value))}
                  className="flex-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40"
                  placeholder="auto-generert-fra-tittel" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Utdrag (vises i liste)</label>
              <textarea value={editExcerpt} onChange={(e) => setEditExcerpt(e.target.value)} rows={2}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40 resize-none"
                placeholder="Kort beskrivelse..." />
            </div>

            <div>
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Innhold</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={16}
                className="w-full mt-1 bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#C4907A]/40 resize-y leading-relaxed font-mono"
                placeholder="Skriv innholdet her... (én linje = ett avsnitt)" />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[10px] text-[#6B5D52] uppercase tracking-wider">Status</label>
              <div className="flex gap-2">
                <button onClick={() => setEditStatus("draft")}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase cursor-pointer ${editStatus === "draft" ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30" : "text-[#6B5D52] border border-[#1A1410]"}`}>
                  Utkast
                </button>
                <button onClick={() => setEditStatus("published")}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase cursor-pointer ${editStatus === "published" ? "bg-green-400/10 text-green-400 border border-green-400/30" : "text-[#6B5D52] border border-[#1A1410]"}`}>
                  Publisert
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setEditing(false); setSelected(null); }}
              className="flex-1 border border-[#1A1410] py-3 text-xs text-[#6B5D52] uppercase tracking-wider hover:text-[#E8DDD4] cursor-pointer">
              Avbryt
            </button>
            <button onClick={savePost} disabled={saving}
              className="flex-1 bg-[#C4907A] text-[#0D0A08] py-3 text-xs font-medium uppercase tracking-wider hover:bg-[#D4A08A] cursor-pointer disabled:opacity-50">
              {saving ? <span className="flex items-center justify-center gap-1.5"><ButtonSpinner /> Lagrer...</span> : selected ? "Oppdater" : "Opprett"}
            </button>
          </div>
        </div>
      ) : (
        /* List */
        <div className="space-y-2">
          {loading ? (
            <><ListItemSkeleton /><ListItemSkeleton /><ListItemSkeleton /></>
          ) : posts.length === 0 ? (
            <div className="bg-[#1A1410] border border-[#1A1410] p-10 text-center text-[#6B5D52] text-sm">
              Ingen blogginnlegg. Klikk «+ Nytt innlegg» for å starte.
            </div>
          ) : posts.map((post) => (
            <div key={post.id} className="bg-[#1A1410] border border-[#1A1410] p-4 flex items-center justify-between">
              <button onClick={() => startEdit(post)} className="flex-1 text-left cursor-pointer">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{post.title}</p>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${
                    post.status === "published" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"
                  }`}>{post.status === "published" ? "Publisert" : "Utkast"}</span>
                </div>
                <p className="text-[11px] text-[#6B5D52] mt-1">
                  /blogg/{post.slug} · {new Date(post.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </button>
              <button onClick={() => deletePost(post.id)}
                className="text-[#6B5D52] hover:text-red-400 cursor-pointer px-3 text-lg">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
