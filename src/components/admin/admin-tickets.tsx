'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Check, X } from 'lucide-react'

interface TicketGrid {
  price: number
  label: string
  tickets: {
    number: number
    status: 'available' | 'sold'
    userName?: string
    userPhone?: string
  }[]
}

export function AdminTickets() {
  const [ticketGrids, setTicketGrids] = useState<TicketGrid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets')
      if (response.ok) {
        const data = await response.json()
        setTicketGrids(data)
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando boletos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Estado de Boletos</h3>
          <p className="text-sm text-muted-foreground">
            Ver boletos vendidos y disponibles
          </p>
        </div>
        <Button onClick={loadTickets} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {ticketGrids.map((grid) => (
          <Card key={grid.price}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {grid.label} - ${grid.price.toLocaleString()}
                <div className="text-sm font-normal text-muted-foreground">
                  {grid.tickets.filter(t => t.status === 'sold').length} / 100 vendidos
                </div>
              </CardTitle>
              <CardDescription>
                Boletos de ${grid.price.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1">
                {grid.tickets.map((ticket) => (
                  <div
                    key={ticket.number}
                    className={`aspect-square flex items-center justify-center text-xs font-bold rounded border transition-all ${
                      ticket.status === 'sold'
                        ? 'bg-white text-black border-white cursor-pointer hover:bg-white/80'
                        : 'bg-transparent border-white/20 text-white/40'
                    }`}
                    title={
                      ticket.status === 'sold'
                        ? `Boleto ${ticket.number} - ${ticket.userName} - ${ticket.userPhone}`
                        : `Boleto ${ticket.number} - Disponible`
                    }
                  >
                    {ticket.status === 'sold' ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      ticket.number
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded" />
                    <span className="text-muted-foreground">Vendido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-transparent border border-white/20 rounded" />
                    <span className="text-muted-foreground">Disponible</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
