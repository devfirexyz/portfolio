import React from 'react'
import { cn } from '@portfolio/utils'
import { Badge } from '../badge'
import { formatDate, readingTime } from '@portfolio/utils'
import type { BlogPost } from '@portfolio/types'

interface BlogCardProps {
  post: BlogPost
  className?: string
  variant?: 'default' | 'featured' | 'compact'
}

export function BlogCard({ post, className, variant = 'default' }: BlogCardProps) {
  const isFeatured = variant === 'featured' || post.featured
  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <CompactBlogCard post={post} className={className} />
    )
  }

  return (
    <article
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-300',
        'bg-white/5 border border-white/10 hover:border-white/20',
        'hover:bg-white/10',
        isFeatured && 'ring-2 ring-primary/50',
        className
      )}
    >
      {isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="default">Featured</Badge>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 text-sm text-white/60">
          {post.category && (
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
          )}
          <span>{post.readingTimeText || `${post.readingTime} min read`}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-white/70 text-sm mb-4 line-clamp-3">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between">
          <time className="text-xs text-white/50">
            {formatDate(post.publishedAt, 'MMM d, yyyy')}
          </time>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function CompactBlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <article
      className={cn(
        'group flex items-start gap-4 p-4 rounded-lg',
        'hover:bg-white/5 transition-colors',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium text-white group-hover:text-primary transition-colors truncate">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
          <time>{formatDate(post.publishedAt, 'MMM d, yyyy')}</time>
          <span>·</span>
          <span>{post.readingTimeText || `${post.readingTime} min read`}</span>
        </div>
      </div>
      {post.category && (
        <Badge variant="outline" className="text-xs shrink-0">
          {post.category}
        </Badge>
      )}
    </article>
  )
}

interface BlogGridProps {
  posts: BlogPost[]
  className?: string
  columns?: 2 | 3
}

export function BlogGrid({ posts, className, columns = 2 }: BlogGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={cn(
      'grid gap-6 grid-cols-1',
      gridCols[columns],
      className
    )}>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
