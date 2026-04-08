'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, RefreshCw, Crown, Trophy, Loader2 } from 'lucide-react'

interface RouletteWheelProps {
  participants?: Array<{
    id: string
    name: string
    number: number
  }>
  onSpinComplete?: (winner: any) => void
  isSpinning?: boolean
}

export function RouletteWheel({
  participants = [],
  onSpinComplete,
  isSpinning: externalSpinning = false
}: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(externalSpinning)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [realParticipants, setRealParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null) // null = all
  const [countsByTier, setCountsByTier] = useState({ bronce: 0, plata: 0, oro: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate demo participants
  const demoParticipants = Array.from({ length: 8 }, (_, i) => ({
    id: `ticket-${i + 1}`,
    name: `Boleto #${i + 1}`,
    number: i + 1
  }))

  // Load real participants from database
  useEffect(() => {
    async function loadParticipants() {
      try {
        setLoading(true)
        const tierParam = selectedTier ? `?tier=${selectedTier}` : ''
        const response = await fetch(`/api/roulette/participants${tierParam}`)
        const data = await response.json()

        if (data.success) {
          setRealParticipants(data.participants || [])
          if (data.countsByTier) {
            setCountsByTier(data.countsByTier)
          }
        } else {
          setRealParticipants([])
        }
      } catch (error) {
        console.error('Error loading participants:', error)
        setRealParticipants([])
      } finally {
        setLoading(false)
      }
    }

    loadParticipants()
  }, [selectedTier])

  // Use real participants if available, otherwise use demo
  const wheelParticipants = realParticipants.length > 0 ? realParticipants : demoParticipants

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10
    const sliceAngle = (2 * Math.PI) / wheelParticipants.length

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw wheel
    wheelParticipants.forEach((participant, index) => {
      const startAngle = (index * sliceAngle + rotation) % (2 * Math.PI)
      const endAngle = startAngle + sliceAngle

      // Draw slice with gold and black colors
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Alternate colors
      if (index % 2 === 0) {
        ctx.fillStyle = '#C5A059' // Gold
      } else {
        ctx.fillStyle = '#1a1a1a' // Dark gray
      }
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#FFD700' // Gold
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = index % 2 === 0 ? '#000' : '#FFD700'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(participant.name, radius - 20, 5)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFD700'
    ctx.fill()
    ctx.strokeStyle = '#C5A059'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw crown in center
    ctx.fillStyle = '#1a1a1a'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('👑', centerX, centerY)
  }

  useEffect(() => {
    drawWheel()
  }, [rotation, wheelParticipants])

  // Add confetti animation styles on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      
      .confetti-animation::before,
      .confetti-animation::after {
        content: '🎉';
        position: absolute;
        animation: confetti-fall 3s ease-in-out infinite;
      }
      
      .confetti-animation::before {
        left: 20%;
        animation-delay: 0s;
      }
      
      .confetti-animation::after {
        right: 20%;
        animation-delay: 1.5s;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      try {
        if (document.head.contains(style)) {
          document.head.removeChild(style)
        }
      } catch (e) {
        // Style element already removed
      }
    }
  }, [])

  const spinWheel = async () => {
    if (isSpinning || wheelParticipants.length === 0) return

    setIsSpinning(true)
    setWinner(null)
    setShowConfetti(false)

    // Random rotation (at least 5 full spins)
    const spins = 5 + Math.random() * 5
    const newRotation = rotation + spins * 2 * Math.PI + Math.random() * 2 * Math.PI

    let currentRotation = rotation
    const targetRotation = newRotation
    const duration = 5000 // 5 seconds
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      currentRotation = rotation + (targetRotation - rotation) * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Determine winner
        const normalizedRotation = currentRotation % (2 * Math.PI)
        const sliceAngle = (2 * Math.PI) / wheelParticipants.length
        const winningIndex = Math.floor((2 * Math.PI - normalizedRotation) / sliceAngle) % wheelParticipants.length
        const selectedWinner = wheelParticipants[winningIndex]

        setWinner(selectedWinner)
        setShowConfetti(true)
        setIsSpinning(false)

        // Save winner to database
        if (selectedWinner.id && selectedWinner.ticketPrice) {
          saveWinnerToDatabase(selectedWinner.id, selectedWinner.ticketPrice)
        }

        if (onSpinComplete) {
          onSpinComplete(selectedWinner)
        }
      }
    }

    requestAnimationFrame(animate)
  }

  const saveWinnerToDatabase = async (ticketId: string, ticketPrice: number) => {
    try {
      // Find the raffle for this ticket price
      const raffleResponse = await fetch('/api/raffles')
      const raffleData = await raffleResponse.json()

      const raffle = raffleData.raffles?.find((r: any) => r.ticketPrice === ticketPrice && r.status === 'active')

      if (!raffle) {
        console.error('No active raffle found for ticket price:', ticketPrice)
        return
      }

      // Save winner
      const response = await fetch('/api/winners/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          raffleId: raffle.id,
          tier: ticketPrice === 1000 ? 'Bronce' : ticketPrice === 2000 ? 'Plata' : 'Oro'
        })
      })

      const data = await response.json()
      console.log('Winner saved:', data)
    } catch (error) {
      console.error('Error saving winner to database:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold" />
              Ruleta de Sorteo
            </CardTitle>
            {/* Status indicator */}
            <div>
              {loading ? (
                <Badge className="bg-muted text-muted-foreground border-0 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando...
                </Badge>
              ) : realParticipants.length > 0 ? (
                <Badge className="bg-green-600 text-white border-0">
                  ✓ {realParticipants.length} Participante{realParticipants.length !== 1 ? 's' : ''} {selectedTier ? `(${selectedTier === '1000' ? 'Bronce' : selectedTier === '2000' ? 'Plata' : 'Oro'})` : ''}
                </Badge>
              ) : (
                <Badge className="bg-yellow-600 text-white border-0">
                  ℹ️ Modo Demo (8 boletos de prueba)
                </Badge>
              )}
            </div>
          </div>

          {/* Tier Selector */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Selecciona el nivel para el sorteo:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedTier === '1000' ? 'default' : 'outline'}
                className={selectedTier === '1000' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'border-amber-600 text-amber-400 hover:bg-amber-600/10'}
                onClick={() => {
                  setSelectedTier('1000')
                  setRotation(0)
                  setWinner(null)
                  setShowConfetti(false)
                }}
                disabled={isSpinning}
              >
                🥉 Bronce (${countsByTier.bronce > 0 ? `${countsByTier.bronce} participantes` : '1,000'})
              </Button>
              <Button
                size="sm"
                variant={selectedTier === '2000' ? 'default' : 'outline'}
                className={selectedTier === '2000' ? 'bg-slate-400 text-black hover:bg-slate-500' : 'border-slate-400 text-slate-300 hover:bg-slate-400/10'}
                onClick={() => {
                  setSelectedTier('2000')
                  setRotation(0)
                  setWinner(null)
                  setShowConfetti(false)
                }}
                disabled={isSpinning}
              >
                🥈 Plata (${countsByTier.plata > 0 ? `${countsByTier.plata} participantes` : '2,000'})
              </Button>
              <Button
                size="sm"
                variant={selectedTier === '3000' ? 'default' : 'outline'}
                className={selectedTier === '3000' ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10'}
                onClick={() => {
                  setSelectedTier('3000')
                  setRotation(0)
                  setWinner(null)
                  setShowConfetti(false)
                }}
                disabled={isSpinning}
              >
                🥇 Oro (${countsByTier.oro > 0 ? `${countsByTier.oro} participantes` : '3,000'})
              </Button>
            </div>
            {selectedTier && (
              <p className="text-xs text-center text-yellow-400">
                ⚠️ Solo se sorteará el nivel seleccionado
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            {/* Arrow indicator */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-gold drop-shadow-lg" />
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="shadow-2xl rounded-full"
            />

            {/* Confetti overlay */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="confetti-animation" />
              </div>
            )}
          </div>
        </div>

        {winner && (
          <Card className="bg-gradient-gold border-0">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 text-background" />
              <h3 className="text-2xl font-bold text-background mb-2">
                ¡Ganador!
              </h3>
              <p className="text-lg text-background/90">
                {winner.name}
              </p>
              {winner.number && (
                <Badge className="mt-2 bg-background text-gold border-0">
                  Boleto #{winner.number}
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            size="lg"
            className="bg-gradient-gold text-background hover:opacity-90"
          >
            <Play className="w-5 h-5 mr-2" />
            {isSpinning ? 'Girando...' : 'Girar Ruleta'}
          </Button>
          <Button
            onClick={() => {
              setRotation(0)
              setWinner(null)
              setShowConfetti(false)
            }}
            disabled={isSpinning}
            size="lg"
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
