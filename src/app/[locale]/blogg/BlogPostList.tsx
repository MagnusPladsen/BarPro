"use client";

import { motion } from "framer-motion";
import { ColorOrbs } from "@/components/ui/ColorOrbs";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string | null;
}

const ease = [0.16, 1, 0.3, 1] as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function BlogPostList({
  posts,
  heroLabel,
  heroHeading,
  emptyMessage,
}: {
  posts: BlogPost[];
  heroLabel: string;
  heroHeading: string;
  emptyMessage: string;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <ColorOrbs size="small" intensity={0.5} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-accent mb-6"
          >
            {heroLabel}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display italic font-light text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1]"
          >
            {heroHeading}
          </motion.h1>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-40 px-6 space-y-24 mt-16">
        {posts.length === 0 && (
          <div className="max-w-3xl mx-auto text-center text-text-muted text-lg">
            {emptyMessage}
          </div>
        )}

        {posts.map((post, i) => (
          <div key={post.id}>
            {i > 0 && (
              <div className="max-w-3xl mx-auto mb-24">
                <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
              </div>
            )}
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px bg-accent" />
                <span className="text-[11px] tracking-[0.25em] uppercase text-text-muted">
                  {formatDate(post.published_at)}
                </span>
              </div>
              <h2 className="font-display italic font-light text-3xl md:text-4xl text-text-primary mb-8 leading-[1.15]">
                {post.title}
              </h2>
              <div className="space-y-6 text-text-muted text-lg leading-relaxed">
                {post.content.split("\n\n").map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </motion.article>
          </div>
        ))}
      </section>
    </>
  );
}
