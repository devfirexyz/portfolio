export interface BlogPost {
  title: string
  description: string
  publishedAt: Date
  updatedAt?: Date
  tags?: string[]
  category?: string
  author?: string
  featured?: boolean
  draft?: boolean
  content: any // MDX content
  rawContent: string
  slug: string
  readingTime: number
  readingTimeText: string
  wordCount: number
}

export interface Author {
  name: string
  bio?: string
  avatar?: string
  role?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
}