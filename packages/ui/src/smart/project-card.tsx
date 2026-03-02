import React from 'react'
import { cn } from '@portfolio/utils'
import { Badge } from '../badge'
import type { Project } from '@portfolio/types'

interface ProjectCardProps {
  project: Project
  className?: string
  variant?: 'default' | 'featured'
}

export function ProjectCard({ project, className, variant = 'default' }: ProjectCardProps) {
  const isFeatured = variant === 'featured' || project.featured

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-300',
        'bg-white/5 border border-white/10 hover:border-white/20',
        'hover:bg-white/10 hover:shadow-2xl',
        isFeatured && 'ring-2 ring-primary/50',
        className
      )}
    >
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isFeatured && (
            <div className="absolute top-3 right-3">
              <Badge variant="default">Featured</Badge>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.status && (
            <StatusBadge status={project.status} />
          )}
        </div>
        
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
        
        <ProjectLinks links={project.links} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
    'archived': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'maintenance': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }

  return (
    <span className={cn(
      'px-2 py-1 text-xs rounded-full border',
      statusStyles[status] || statusStyles['completed']
    )}>
      {status.replace('-', ' ')}
    </span>
  )
}

function ProjectLinks({ links }: { links?: Project['links'] }) {
  if (!links) return null

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Live Demo
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          GitHub
        </a>
      )}
      {links.documentation && (
        <a
          href={links.documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Docs
        </a>
      )}
    </div>
  )
}

interface ProjectGridProps {
  projects: Project[]
  className?: string
  columns?: 2 | 3 | 4
}

export function ProjectGrid({ projects, className, columns = 3 }: ProjectGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={cn(
      'grid gap-6 grid-cols-1',
      gridCols[columns],
      className
    )}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
