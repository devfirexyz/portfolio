"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image: string
    tags: string[]
    color: string
  }
  index: number
  inView: boolean
}

export default function ProjectCard({ project, index, inView }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 overflow-hidden h-full hover:border-purple-500/50 transition-all duration-300 flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(to top, rgb(17, 24, 39), transparent), 
                           linear-gradient(to right, ${project.color}22, transparent)`,
            }}
          />
        </div>
        <CardContent className="p-6 flex-1 flex flex-col">
          <h3
            className="text-xl font-semibold mb-2 hover:text-purple-400 transition-colors"
            style={{ color: project.color }}
          >
            {project.title}
          </h3>
          <p className="text-gray-400 mb-4 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800/50">
              <Github className="h-4 w-4 mr-2" />
              Code
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800/50">
              <ExternalLink className="h-4 w-4 mr-2" />
              Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
