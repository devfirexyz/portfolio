export interface BlogPost {
  title: string
  description: string
  publishedAt: Date | string
  updatedAt?: Date | string
  tags?: string[]
  category?: string
  author?: Author
  featured?: boolean
  draft?: boolean
  content: unknown
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
  social?: SocialLinks
}

export interface SocialLinks {
  twitter?: string
  github?: string
  linkedin?: string
  website?: string
  email?: string
}
