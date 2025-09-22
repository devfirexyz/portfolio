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
      <article className="group py-4 sm:py-6 border-b border-gray-400 dark:border-gray-800/50 last:border-b-0">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {post.category && (
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight">
                {post.title}
              </h3>

              <p className="text-gray-900 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2 sm:line-clamp-1 text-sm">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-900 dark:text-gray-400">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Thumbnail - smaller on mobile, positioned at top right */}
            <div className="flex-shrink-0 self-start sm:ml-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg flex items-center justify-center group-hover:from-gray-300 group-hover:to-gray-400 dark:group-hover:from-gray-700/70 dark:group-hover:to-gray-600/70 transition-all duration-200 border border-gray-400 dark:border-white/10">
              <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-400">
                {post.title.charAt(0)}
              </div>
        </div>
      </div>
        </Link>
      </article>
    )
  }