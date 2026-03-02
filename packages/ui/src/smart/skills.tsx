import React from 'react'
import { cn } from '@portfolio/utils'
import { Badge } from '../badge'

interface SkillBadgeProps {
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  className?: string
}

export function SkillBadge({ name, level = 'intermediate', className }: SkillBadgeProps) {
  const levelColors = {
    beginner: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    expert: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  }

  return (
    <span className={cn(
      'px-3 py-1.5 text-sm rounded-full border',
      levelColors[level],
      className
    )}>
      {name}
    </span>
  )
}

interface SkillCategoryProps {
  title: string
  skills: Array<{ name: string; level?: SkillBadgeProps['level'] }>
  className?: string
}

export function SkillCategory({ title, skills, className }: SkillCategoryProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  )
}

interface ExperienceItemProps {
  title: string
  company: string
  period: string
  description?: string
  achievements?: string[]
  technologies?: string[]
  className?: string
}

export function ExperienceItem({
  title,
  company,
  period,
  description,
  achievements,
  technologies,
  className,
}: ExperienceItemProps) {
  return (
    <div className={cn('relative pl-6 pb-8 border-l border-white/10', className)}>
      <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-primary -translate-x-1.5" />
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-lg font-semibold text-white">{title}</h4>
            <p className="text-primary text-sm">{company}</p>
          </div>
          <span className="text-xs text-white/50">{period}</span>
        </div>
        
        {description && (
          <p className="text-white/70 text-sm mb-3">{description}</p>
        )}
        
        {achievements && achievements.length > 0 && (
          <ul className="list-disc list-inside text-white/70 text-sm mb-3 space-y-1">
            {achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        )}
        
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
