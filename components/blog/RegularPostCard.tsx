import Link from "next/link";
import { BlogPost } from "@/types/blog";

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function RegularPostCard({ post }: { post: BlogPost }) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="block">
          {/* Modern compact card */}
          <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 p-6 group">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Category */}
                  {post.category && (
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/8 text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-500/15 mb-3">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                      {post.category}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 mb-4 leading-relaxed line-clamp-2 text-sm">
                    {post.description}
                  </p>
                </div>

                {/* Compact thumbnail */}
                <div className="flex-shrink-0 ml-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 border border-white/[0.08]">
                  <div className="text-sm font-bold text-white/80">
                    {post.title.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-white/50">#{post.tags[0]}</span>
                    </>
                  )}
                </div>

                {/* Arrow indicator */}
                <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }