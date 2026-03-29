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
    if (s >= 70) return 'stroke-success'
    if (s >= 50) return 'stroke-warning'
    return 'stroke-danger'
  }

  const getTextColor = (s: number) => {
    if (s >= 70) return 'text-success'
    if (s >= 50) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-border"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${getColor(score)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getTextColor(score)}`}>
          {animatedScore}
        </span>
        <span className="text-xs text-text-secondary font-medium tracking-wide">
          / 100
        </span>
      </div>
    </div>
  )
}
