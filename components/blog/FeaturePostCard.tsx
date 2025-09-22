import Link from "next/link";
import type { BlogPost } from "@/types/blog";

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function FeaturedPostCard({ post }: { post: BlogPost }) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`} className="block">
          {/* Modern glassmorphism card */}
          <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-purple-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-8">
              {/* Header with category and featured badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {post.category && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/20">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {post.category}
                    </span>
                  )}
                  {post.featured && (
                    <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-500/20">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>

                {/* Reading time */}
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  {post.readingTime} min read
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-lg text-white/70 mb-6 leading-relaxed line-clamp-2">
                {post.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-white/[0.05] text-white/60 px-2.5 py-1 rounded-md text-xs border border-white/[0.08]">
                      #{post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Read more arrow */}
                <div className="flex items-center gap-2 text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  <span className="text-sm font-medium">Read more</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }