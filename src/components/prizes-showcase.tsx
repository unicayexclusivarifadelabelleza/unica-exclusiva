'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Package, Crown } from 'lucide-react'

interface Prize {
  id: string
  name: string
  description?: string
  value: number
  imageUrl?: string
}

interface PrizesResponse {
  prizes: Prize[]
  prizesByTier?: {
    bronce: Prize[]
    plata: Prize[]
    oro: Prize[]
  }
}

export function PrizesShowcase() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrizes() {
      try {
        const response = await fetch('/api/prizes')
        const data: PrizesResponse = await response.json()
        setPrizes(data.prizes || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching prizes:', err)
        setError('No se pudieron cargar los premios')
        setLoading(false)
      }
    }

    fetchPrizes()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Cargando premios...</p>
      </div>
    )
  }

  if (error || prizes.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {error || 'Próximamente: ¡Los premios de esta rifa serán revelados muy pronto!'}
        </p>
      </div>
    )
  }

  const getTierColor = (value: number) => {
    if (value <= 15000) return 'from-amber-600 to-amber-800'
    if (value <= 25000) return 'from-slate-300 to-slate-500'
    return 'from-yellow-400 to-yellow-600'
  }

  const getTierBadge = (value: number) => {
    if (value <= 15000) return { label: 'Bronce', color: 'bg-amber-600' }
    if (value <= 25000) return { label: 'Plata', color: 'bg-slate-400' }
    return { label: 'Oro', color: 'bg-yellow-500' }
  }

  const getTierIcon = (value: number) => {
    if (value <= 15000) return <Package className="w-5 h-5" />
    if (value <= 25000) return <Sparkles className="w-5 h-5" />
    return <Crown className="w-5 h-5" />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prizes.map((prize) => {
        const tier = getTierBadge(prize.value)
        const gradient = getTierColor(prize.value)
        const icon = getTierIcon(prize.value)

        return (
          <Card
            key={prize.id}
            className="group overflow-hidden hover:shadow-elegant transition-all hover:scale-105 border border-white/20"
          >
            {/* Image Section */}
            <div className={`relative h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
              {prize.imageUrl ? (
                <img
                  src={prize.imageUrl}
                  alt={prize.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/30">
                  <Package className="w-16 h-16 text-white/50" />
                </div>
              )}
              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <Badge className={`${tier.color} text-white border-0 px-4 py-2`}>
                  <span className="font-bold">${prize.value.toLocaleString()}</span>
                </Badge>
              </div>
              {/* Tier Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                  {tier.label}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
                  <span className="text-white">{icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-white mb-1 line-clamp-2">
                    {prize.name}
                  </h4>
                  {prize.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {prize.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Prize Value Highlight */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor del premio</span>
                  <span className="font-bold text-white text-lg">
                    ${prize.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
