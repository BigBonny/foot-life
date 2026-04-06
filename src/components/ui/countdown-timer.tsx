'use client'

import { useState, useEffect } from 'react'
import { Clock, Timer } from 'lucide-react'

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Calculate time until next midnight (24:00)
    const calculateTimeLeft = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0) // Set to midnight
      
      const difference = tomorrow.getTime() - now.getTime()
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="flex items-center space-x-2 bg-sunset-gradient text-white px-3 py-1.5 rounded-lg shadow-lg">
      <Timer className="h-4 w-4" />
      <div className="flex items-center space-x-1">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{formatNumber(timeLeft.hours)}</span>
          <span className="text-xs uppercase tracking-wide">H</span>
        </div>
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-xs uppercase tracking-wide">Min</span>
        </div>
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-xs uppercase tracking-wide">Sec</span>
        </div>
      </div>
      <div className="ml-2">
        <p className="text-xs font-semibold">Offre Limitée!</p>
        <p className="text-xs">-30% sur chaque produit</p>
      </div>
    </div>
  )
}
