export interface SiteConfig {
  name: string
  description: string
  url: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    youtube?: string
    discord?: string
  }
  navigation?: NavigationItem[]
}

export interface NavigationItem {
  label: string
  href: string
  external?: boolean
  children?: NavigationItem[]
}

export interface SEOConfig {
  title: string
  description: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

export type Theme = 'light' | 'dark' | 'system'
