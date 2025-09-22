import { BlogLayout } from '@/components/blog/BlogLayout'
import FeaturedPostCard from '@/components/blog/FeaturePostCard'
import RegularPostCard from '@/components/blog/RegularPostCard'
import type{ BlogPost } from '@/types/blog'
import { getAllPosts } from '@/lib/blog'

export default async function BlogIndex() {
  const posts = await getAllPosts();

  const sortedPosts = posts
    .filter((post: BlogPost) => !post.draft)
    .sort((a: BlogPost, b: BlogPost) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const featuredPosts = sortedPosts.filter((post: BlogPost) => post.featured)
  const regularPosts = sortedPosts.filter((post: BlogPost) => !post.featured)


  return (
    <BlogLayout>
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Blog
            </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Thoughts on software development, web technologies, and my journey as a developer.
            </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {/* Year Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12">2024</h2>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
            <div className="space-y-8 sm:space-y-12 mb-12 sm:mb-16">
              {featuredPosts.map((post: BlogPost) => (
                <FeaturedPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Regular Posts */}
          <div className="space-y-6 sm:space-y-8">
            {regularPosts.map((post: BlogPost) => (
              <RegularPostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Empty state */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                  Check back soon for updates on my developer journey!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {sortedPosts.length > 6 && (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 pt-8 sm:pt-12 border-t border-gray-200 dark:border-gray-800">
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded">
              1
            </span>
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              2
            </span>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="hidden sm:inline">Next</span> →
            </button>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}