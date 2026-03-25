"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { Database, MessageStatus } from "@/lib/supabase/types";
import { MessageListItemSkeleton } from "@/components/ui/LoadingState";
import { ButtonSpinner } from "@/components/ui/Skeleton";

type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<MessageStatus | "all">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: MessageStatus) => {
    setUpdating(true);
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
    await fetchMessages();
    setUpdating(false);
  };

  const saveNotes = async (id: string) => {
    setUpdating(true);
    await supabase.from("contact_messages").update({ admin_notes: adminNotes }).eq("id", id);
    await fetchMessages();
    setUpdating(false);
  };

  const selectMessage = async (message: Message) => {
    setSelected(message);
    setAdminNotes(message.admin_notes ?? "");

    // Auto-mark as read
    if (message.status === "unread") {
      await updateStatus(message.id, "read");
    }
  };

  const statusColors: Record<string, string> = {
    unread: "text-[#B88E64] bg-[#B88E64]/10",
    read: "text-[#6B5D52] bg-[#6B5D52]/10",
    replied: "text-green-400 bg-green-400/10",
  };

  const statusLabels: Record<string, string> = {
    unread: "Ulest",
    read: "Lest",
    replied: "Besvart",
  };

  const filters: { value: MessageStatus | "all"; label: string }[] = [
    { value: "all", label: "Alle" },
    { value: "unread", label: "Ulest" },
    { value: "read", label: "Lest" },
    { value: "replied", label: "Besvart" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Meldinger</h1>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-[#B88E64]/10 text-[#B88E64] border border-[#B88E64]/30"
                : "text-[#6B5D52] border border-[#1A1410] hover:text-[#E8DDD4]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className={`${selected ? "w-1/2" : "w-full"} space-y-2 transition-all`}>
          {loading ? (
            <>
              <MessageListItemSkeleton />
              <MessageListItemSkeleton />
              <MessageListItemSkeleton />
              <MessageListItemSkeleton />
              <MessageListItemSkeleton />
            </>
          ) : messages.length === 0 ? (
            <div className="bg-[#1A1410] border border-[#1A1410] p-10 text-center text-[#6B5D52] text-sm">
              Ingen meldinger
            </div>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMessage(m)}
                className={`w-full text-left bg-[#1A1410] border p-4 transition-colors cursor-pointer ${
                  selected?.id === m.id
                    ? "border-[#B88E64]/40"
                    : "border-[#1A1410] hover:border-[#B88E64]/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${m.status === "unread" ? "font-semibold" : ""}`}>
                    {m.name}
                  </p>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 ${statusColors[m.status]}`}>
                    {statusLabels[m.status]}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B5D52] mt-1 line-clamp-1">{m.message}</p>
                <p className="text-[10px] text-[#6B5D52]/60 mt-1">
                  {new Date(m.created_at).toLocaleDateString("no-NO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-1/2 bg-[#1A1410] border border-[#1A1410] p-6 sticky top-8 self-start">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">{selected.name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-[#6B5D52] hover:text-[#E8DDD4] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">E-post</p>
                <a href={`mailto:${selected.email}`} className="text-[#B88E64] hover:underline">
                  {selected.email}
                </a>
              </div>

              {selected.phone && (
                <div>
                  <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Telefon</p>
                  <a href={`tel:${selected.phone}`} className="text-[#B88E64] hover:underline">
                    {selected.phone}
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selected.event_type && (
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Type</p>
                    <p>{selected.event_type}</p>
                  </div>
                )}
                {selected.guests && (
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Gjester</p>
                    <p>{selected.guests}</p>
                  </div>
                )}
                {selected.date && (
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Dato</p>
                    <p>{selected.date}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#1A1410] pt-4">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-2">Melding</p>
                <p className="text-[#E8DDD4] whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>

              <p className="text-[10px] text-[#6B5D52]">
                Mottatt {new Date(selected.created_at).toLocaleDateString("no-NO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Admin notes */}
              <div className="border-t border-[#1A1410] pt-4">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-2">Admin-notater</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm text-[#E8DDD4] outline-none focus:border-[#B88E64]/40 transition-colors resize-none"
                  placeholder="Interne notater..."
                />
                <button
                  onClick={() => saveNotes(selected.id)}
                  disabled={updating}
                  className="mt-2 text-[11px] text-[#B88E64] hover:underline cursor-pointer disabled:opacity-50"
                >
                  Lagre notater
                </button>
              </div>

              {/* Actions */}
              <div className="border-t border-[#1A1410] pt-4 flex gap-2">
                {selected.status !== "replied" && (
                  <button
                    onClick={() => updateStatus(selected.id, "replied")}
                    disabled={updating}
                    className="flex-1 bg-green-400/10 text-green-400 border border-green-400/30 py-2 text-xs uppercase tracking-wider hover:bg-green-400/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {updating ? <span className="flex items-center justify-center gap-1.5"><ButtonSpinner />Behandler...</span> : "Marker som besvart"}
                  </button>
                )}
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 bg-[#B88E64]/10 text-[#B88E64] border border-[#B88E64]/30 py-2 text-xs uppercase tracking-wider text-center hover:bg-[#B88E64]/20 transition-colors"
                >
                  Svar via e-post
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
