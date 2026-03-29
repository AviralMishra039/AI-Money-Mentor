'use client'

import { useEffect, useState } from 'react'

export function ScoreRing({ score, animate = true }: { score: number, animate?: boolean }) {
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : score)
  
  useEffect(() => {
    if (!animate) return
    const timeout = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timeout)
  }, [score, animate])

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference
  
  const getColor = (s: number) => {
    if (s >= 70) return '#16a34a'
    if (s >= 50) return '#d97706'
    return '#dc2626'
  }

  const getLabel = (s: number) => {
    if (s >= 80) return 'Excellent'
    if (s >= 70) return 'Good'
    if (s >= 50) return 'Fair'
    return 'Needs Work'
  }

  const color = getColor(score)

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-44 h-44">
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e8e0d8"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Glow effect */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-[1500ms] ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
          {/* Main ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-black" style={{ color }}>
            {animatedScore}
          </span>
          <span className="text-[10px] font-bold text-text-tertiary tracking-[0.15em] uppercase mt-0.5">
            out of 100
          </span>
        </div>
      </div>
      <div 
        className="mt-3 et-badge border"
        style={{ 
          backgroundColor: `${color}10`, 
          color, 
          borderColor: `${color}30` 
        }}
      >
        {getLabel(score)}
      </div>
    </div>
  )
}
