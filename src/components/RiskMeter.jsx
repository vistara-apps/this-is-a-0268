import React from 'react'

const RiskMeter = ({ score, size = 'md' }) => {
  const getColor = (score) => {
    if (score < 30) return '#10B981' // green
    if (score < 70) return '#F59E0B' // yellow
    return '#EF4444' // red
  }

  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 40, height: 40, strokeWidth: 3 }
      case 'lg': return { width: 80, height: 80, strokeWidth: 4 }
      default: return { width: 60, height: 60, strokeWidth: 3 }
    }
  }

  const { width, height, strokeWidth } = getSize()
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-block">
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {size !== 'sm' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-lg' : 'text-sm'}`} style={{ color: getColor(score) }}>
            {score}%
          </span>
        </div>
      )}
    </div>
  )
}

export default RiskMeter