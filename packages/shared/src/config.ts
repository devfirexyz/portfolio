export const SITE_CONFIG = {
  name: 'Piyush Raj',
  description: 'Software Development Engineer III',
  url: 'https://devfire.xyz',
  author: {
    name: 'Piyush Raj',
    email: 'piyushraj888s@gmail.com',
    avatar: 'https://github.com/devfirexyz.png',
  },
  social: {
    github: 'https://github.com/devfirexyz',
    linkedin: 'https://linkedin.com/in/piyush-raj-60a6a2117',
    twitter: 'https://x.com/piyushrajthemt',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ],
} as const

export type SiteConfigType = typeof SITE_CONFIG
