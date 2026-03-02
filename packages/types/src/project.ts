export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image?: string
  images?: string[]
  tags: string[]
  category: ProjectCategory
  links?: ProjectLinks
  featured?: boolean
  status?: ProjectStatus
  startDate?: Date | string
  endDate?: Date | string
}

export type ProjectCategory = 
  | 'web'
  | 'mobile'
  | 'backend'
  | 'fullstack'
  | 'library'
  | 'tool'
  | 'other'

export type ProjectStatus = 
  | 'in-progress'
  | 'completed'
  | 'archived'
  | 'maintenance'

export interface ProjectLinks {
  live?: string
  github?: string
  demo?: string
  documentation?: string
}
