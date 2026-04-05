'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, XCircle, Ticket, Phone, Mail, RefreshCw } from 'lucide-react'

interface Purchase {
  id: string
  paymentId: string
  userName: string
  userPhone: string
  userEmail?: string
  ticketNumbers: number[]
  ticketPrice: number
  total: number
  ticketType: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  soldAt?: string
}

export function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = async () => {
    try {
      const response = await fetch('/api/admin/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: 'completed' | 'failed') => {
    setUpdating(paymentId)
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status })
      })

      if (response.ok) {
        await loadPurchases()
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Completado</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Fallido</Badge>
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>
    }
  }

  const getTypeColor = (price: number) => {
    switch (price) {
      case 1000: return 'text-amber-600'
      case 2000: return 'text-slate-300'
      case 3000: return 'text-yellow-500'
      default: return 'text-white'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando compras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Historial de Compras</h3>
          <p className="text-sm text-muted-foreground">
            {purchases.length} compra{purchases.length !== 1 ? 's' : ''} registrada{purchases.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={loadPurchases} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="space-y-3">
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                No hay compras registradas
              </p>
            </CardContent>
          </Card>
        ) : (
          purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(purchase.status)}
                      <Badge variant="outline" className={getTypeColor(purchase.ticketPrice)}>
                        <Ticket className="w-3 h-3 mr-1" />
                        {purchase.ticketType} (${purchase.ticketPrice.toLocaleString()})
                      </Badge>
                    </div>

                    <div>
                      <p className="font-semibold">{purchase.userName}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        {purchase.userPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {purchase.userPhone}
                          </span>
                        )}
                        {purchase.userEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {purchase.userEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Boletos:</span>
                      <div className="flex flex-wrap gap-1">
                        {purchase.ticketNumbers.map((num) => (
                          <Badge key={num} variant="outline" className="text-xs px-2 py-0">
                            {num}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold text-white">${purchase.total.toLocaleString()} CLP</span>
                      {' • '}
                      Fecha: {new Date(purchase.createdAt).toLocaleDateString('es-CL')}
                    </div>
                  </div>

                  {purchase.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => updatePaymentStatus(purchase.paymentId, 'completed')}
                        disabled={updating === purchase.paymentId}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {updating === purchase.paymentId ? '...' : 'Marcar Pagado'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updatePaymentStatus(purchase.paymentId, 'failed')}
                        disabled={updating === purchase.paymentId}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {updating === purchase.paymentId ? '...' : 'Marcar Fallido'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
