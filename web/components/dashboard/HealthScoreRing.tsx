'use client'

interface HealthScoreRingProps {
  score: number
}

export function HealthScoreRing({ score }: HealthScoreRingProps) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference
  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference / 4}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="32" y="37" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
          {score}
        </text>
      </svg>
      <span className="text-[10px] font-medium text-brand-200 text-center leading-none">Salud<br/>financiera</span>
    </div>
  )
}
