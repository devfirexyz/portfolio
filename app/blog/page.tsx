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
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/70 font-medium">Personal Blog</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Latest <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Thoughts</span>
            </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Insights on software development, emerging technologies, and lessons learned building modern applications.
            </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Year Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-3xl font-semibold text-white">2024</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
            <div className="space-y-8 mb-20">
              {featuredPosts.map((post: BlogPost) => (
                <FeaturedPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Regular Posts */}
          <div className="grid gap-6">
            {regularPosts.map((post: BlogPost) => (
              <RegularPostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Empty state */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  No posts yet
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Check back soon for insights on development, technology, and my coding journey.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {sortedPosts.length > 6 && (
          <div className="flex items-center justify-center space-x-2 pt-16 border-t border-white/[0.08]">
            <button className="px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200">
              ← <span className="hidden sm:inline ml-1">Previous</span>
            </button>
            <div className="flex items-center space-x-1">
              <span className="px-3 py-2 text-sm bg-white/[0.12] text-white rounded-lg font-medium">
                1
              </span>
              <span className="px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.08] cursor-pointer rounded-lg transition-all duration-200">
                2
              </span>
            </div>
            <button className="px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200">
              <span className="hidden sm:inline mr-1">Next</span> →
            </button>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}