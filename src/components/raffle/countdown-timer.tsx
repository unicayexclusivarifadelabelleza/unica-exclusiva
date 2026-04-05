'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar } from 'lucide-react'

interface CountdownTimerProps {
  targetDay?: number // 0-6, where 0 = Sunday, 6 = Saturday
  targetHour?: number // 0-23
  targetMinute?: number // 0-59
  title?: string
  subtitle?: string
}

interface TimeBlockProps {
  value: number
  label: string
}

function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="text-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-white/30 shadow-lg">
        <div className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-sm md:text-base text-white font-semibold uppercase mt-2 tracking-wider">
          {label}
        </div>
      </div>
    </div>
  )
}

export function CountdownTimer({
  targetDay = 4, // Thursday
  targetHour = 21, // 9 PM
  targetMinute = 0,
  title = "Próximo Sorteo",
  subtitle = "Jueves a las 9 PM"
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const target = new Date()
      
      // Set target to next Thursday at 9 PM
      const currentDay = now.getDay()
      const daysUntilThursday = (targetDay - currentDay + 7) % 7
      
      target.setDate(now.getDate() + daysUntilThursday)
      target.setHours(targetHour, targetMinute, 0, 0)
      
      // If target is earlier than now, it means we passed it this week, add 7 days
      if (target < now) {
        target.setDate(target.getDate() + 7)
      }

      const diff = target.getTime() - now.getTime()
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    const updateTime = () => {
      setTimeLeft(calculateTimeLeft())
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [targetDay, targetHour, targetMinute])

  return (
    <Card className="bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-white shadow-2xl">
      <CardContent className="p-8 md:p-12">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-white text-black border-0 px-6 py-2 text-base font-semibold">
            <Clock className="w-5 h-5 mr-2" />
            Cuenta Regresiva
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            {title}
          </h3>
          <p className="text-white/90 flex items-center justify-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
          <TimeBlock value={timeLeft.days} label="Días" />
          <TimeBlock value={timeLeft.hours} label="Horas" />
          <TimeBlock value={timeLeft.minutes} label="Minutos" />
          <TimeBlock value={timeLeft.seconds} label="Segundos" />
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg">
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 ? (
              <span className="text-white font-bold text-xl animate-pulse">¡SORTEO EN CURSO! 🎡</span>
            ) : (
              <span className="text-white/90 font-medium">Compra tu boleto y participa en el próximo sorteo</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
