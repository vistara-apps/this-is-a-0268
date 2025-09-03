import React, { useEffect, useRef } from 'react'

const WaveformVisualization = ({ showSampleMarkers = false }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Generate mock waveform data
    const samples = 200
    const waveformData = Array.from({ length: samples }, (_, i) => {
      const x = i / samples
      return Math.sin(x * Math.PI * 8) * 0.3 + 
             Math.sin(x * Math.PI * 20) * 0.1 + 
             Math.sin(x * Math.PI * 40) * 0.05 +
             (Math.random() - 0.5) * 0.1
    })

    // Draw waveform
    ctx.beginPath()
    const centerY = height / 2
    
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * width
      const amplitude = waveformData[i] * centerY * 0.8
      
      if (i === 0) {
        ctx.moveTo(x, centerY + amplitude)
      } else {
        ctx.lineTo(x, centerY + amplitude)
      }
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, 'hsl(270, 70%, 60%)')
    gradient.addColorStop(0.5, 'hsl(320, 70%, 60%)')
    gradient.addColorStop(1, 'hsl(270, 70%, 60%)')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw sample markers if enabled
    if (showSampleMarkers) {
      const markers = [
        { position: 0.15, label: 'Funky Drummer', color: '#10B981' },
        { position: 0.45, label: 'Apache', color: '#EF4444' }
      ]

      markers.forEach(marker => {
        const x = marker.position * width
        
        // Draw marker line
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.strokeStyle = marker.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw marker dot
        ctx.beginPath()
        ctx.arc(x, 10, 4, 0, 2 * Math.PI)
        ctx.fillStyle = marker.color
        ctx.fill()
      })
    }

    // Draw center line
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

  }, [showSampleMarkers])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-24 sm:h-32 rounded-lg bg-black/20"
        style={{ maxHeight: '120px' }}
      />
    </div>
  )
}

export default WaveformVisualization