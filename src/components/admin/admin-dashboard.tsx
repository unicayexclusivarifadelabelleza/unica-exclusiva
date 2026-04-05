'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Ticket, DollarSign, Users, ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react'

interface DashboardStats {
  totalTicketsSold: number
  totalRevenue: number
  pendingPayments: number
  completedPayments: number
  totalCustomers: number
  ticketsByPrice: {
    price: number
    sold: number
  }[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay estadísticas disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boletos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTicketsSold}</div>
            <p className="text-xs text-muted-foreground">Boletos vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recaudado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">CLP total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
            <p className="text-xs text-muted-foreground">Pagos verificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Por verificar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Boletos por Tipo</CardTitle>
          <CardDescription>Ventas por categoría de boleto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.ticketsByPrice.map((item) => (
              <div key={item.price} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    ${item.price.toLocaleString()}
                  </Badge>
                  <span className="text-sm">
                    {item.price === 1000 ? 'Bronce' : item.price === 2000 ? 'Plata' : 'Oro'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold">{item.sold}</span>
                    <span className="text-sm text-muted-foreground"> / 100</span>
                  </div>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/50 transition-all"
                      style={{ width: `${item.sold}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
