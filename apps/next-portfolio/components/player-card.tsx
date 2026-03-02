"use client"

import { motion } from "framer-motion"
import { Trophy, Zap, Target, Crown, Cpu, Rocket } from "lucide-react"

const PlayerCard = () => {
  const stats = [
    { name: "Level", value: "80", icon: Crown, color: "text-yellow-400" },
    { name: "XP", value: "458.2K", icon: Zap, color: "text-blue-400" },
    { name: "Quests", value: "164", icon: Target, color: "text-green-400" },
    { name: "Achievements", value: "42", icon: Trophy, color: "text-purple-400" },
  ]

  const badges = [
    { name: "Full Stack Master", icon: Cpu, level: "Legendary" },
    { name: "Code Architect", icon: Rocket, level: "Epic" },  
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-sm p-6 backdrop-blur-lg rounded-xl border border-purple-500/20 bg-black/40"
    >
      {/* Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 rounded-xl" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] rounded-xl" />
      
      {/* Player Level Banner */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-purple-400">PLAYER STATS</div>
          <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            Online
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"
        >
          <Crown className="w-4 h-4 text-purple-400" />
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-sm text-gray-400">{stat.name}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            {/* Animated corner accent */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500/50" />
          </motion.div>
        ))}
      </div>

      {/* Achievement Badges */}
      <div className="space-y-3">
        <div className="text-sm text-gray-400 mb-2">Recent Achievements</div>
        {badges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="relative flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <badge.icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium">{badge.name}</div>
              <div className="text-sm text-purple-400">{badge.level}</div>
            </div>
            {/* Improved shimmer effect */}
            <div 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </motion.div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </motion.div>
  )
}

export default PlayerCard 