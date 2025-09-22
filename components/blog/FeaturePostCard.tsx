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
          {/* Mobile-first stacked layout, desktop horizontal layout */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Thumbnail - full width on mobile, fixed width on desktop */}
            <div className="w-full sm:flex-shrink-0 sm:w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg flex items-center justify-center group-hover:from-gray-300 group-hover:to-gray-400 dark:group-hover:from-gray-700/70 dark:group-hover:to-gray-600/70 transition-all duration-200 border border-gray-400 dark:border-white/10">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-400">
                {post.title.charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {post.category && (
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
                {post.featured && (
                  <span className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight">
                {post.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-900 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-900 dark:text-gray-400">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{post.readingTime} min read</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="bg-gray-800 dark:bg-gray-800 text-white dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      #{post.tags[0]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }