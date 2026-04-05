'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react'

interface ExpiredTicket {
  ticketNumber: number
  userName: string
  expiresAt: string
}

interface TicketStats {
  expired: number
  expiringSoon: number
}

export function TicketManagement() {
  const [stats, setStats] = useState<TicketStats>({ expired: 0, expiringSoon: 0 })
  const [expiredTickets, setExpiredTickets] = useState<ExpiredTicket[]>([])
  const [expiringSoon, setExpiringSoon] = useState<ExpiredTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [releasing, setReleasing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tickets/release-expired')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setExpiredTickets(data.expiredTickets || [])
        setExpiringSoon(data.expiringSoon || [])
      }
    } catch (error) {
      console.error('Error fetching ticket stats:', error)
      setMessage({ type: 'error', text: 'Error al cargar estadísticas' })
    } finally {
      setLoading(false)
    }
  }

  const releaseExpiredTickets = async () => {
    try {
      setReleasing(true)
      const response = await fetch('/api/tickets/release-expired', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: `✅ ${data.message}`
        })
        await fetchStats() // Refresh stats
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al liberar tickets' })
      }
    } catch (error) {
      console.error('Error releasing expired tickets:', error)
      setMessage({ type: 'error', text: 'Error al liberar tickets' })
    } finally {
      setReleasing(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Gestión de Tickets</h3>
          <p className="text-muted-foreground">
            Monitorea y libera tickets que no fueron pagados
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchStats}
            variant="outline"
            disabled={loading}
            className="border-white text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={releaseExpiredTickets}
            disabled={stats.expired === 0 || releasing}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {releasing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Liberando...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Liberar {stats.expired} Ticket{stats.expired !== 1 ? 's' : ''} Expirado{stats.expired !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>

      {message && (
        <Card className={`border-2 ${message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <CardContent className="p-4">
            <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {message.text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Tickets Expirados
              </CardTitle>
              <Badge className="bg-red-600 text-white">
                {stats.expired}
              </Badge>
            </div>
            <CardDescription>
              Tickets que no fueron pagados y deben liberarse
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expiredTickets.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {expiredTickets.map((ticket, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-black/30 rounded">
                    <div>
                      <span className="font-semibold">Boleto #{ticket.ticketNumber}</span>
                      <span className="text-muted-foreground ml-2">- {ticket.userName}</span>
                    </div>
                    <Badge variant="outline" className="border-red-500 text-red-400 text-xs">
                      Expirado
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay tickets expirados
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                Por Expirar (5 min)
              </CardTitle>
              <Badge className="bg-yellow-600 text-white">
                {stats.expiringSoon}
              </Badge>
            </div>
            <CardDescription>
              Tickets que expiran en los próximos 5 minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expiringSoon.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {expiringSoon.map((ticket, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-black/30 rounded">
                    <div>
                      <span className="font-semibold">Boleto #{ticket.ticketNumber}</span>
                      <span className="text-muted-foreground ml-2">- {ticket.userName}</span>
                    </div>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                      Expira pronto
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay tickets por expirar
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            ¿Cómo Funciona?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">1</Badge>
            <div>
              <p className="font-semibold">Reserva</p>
              <p className="text-muted-foreground">
                Cuando alguien inicia una compra, los tickets se marcan como "reservados" por 15 minutos
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">2</Badge>
            <div>
              <p className="font-semibold">Pago</p>
              <p className="text-muted-foreground">
                Si el pago se completa, los tickets cambian a "vendidos" y aparecen en la ruleta
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">3</Badge>
            <div>
              <p className="font-semibold">Expiración</p>
              <p className="text-muted-foreground">
                Si no pagan en 15 minutos, los tickets expiran y puedes liberarlos manualmente
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-yellow-400 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Importante: Solo aparecen en la ruleta tickets con pagos COMPLETADOS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
