'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Clock, Search, Loader2, User, Ticket, DollarSign, Phone } from 'lucide-react'

interface Payment {
  id: string
  status: string
  amount: number
  createdAt: string
  updatedAt: string
  transactionId?: string
  preferenceId?: string
  user: {
    name: string
    phone: string
    email: string
  }
  tickets: Array<{
    id: string
    number: number
    status: string
  }>
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/payments')
      const data = await response.json()

      if (data.success) {
        setPayments(data.payments || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cargar pagos' })
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      setMessage({ type: 'error', text: 'Error al cargar pagos' })
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (paymentId: string) => {
    try {
      setConfirming(paymentId)

      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({
          type: 'success',
          text: `✅ ${data.message}`
        })
        await fetchPayments() // Refresh payments
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al confirmar pago' })
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      setMessage({ type: 'error', text: 'Error al confirmar pago' })
    } finally {
      setConfirming(null)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  useEffect(() => {
    fetchPayments()
    // Refresh every 30 seconds
    const interval = setInterval(fetchPayments, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.phone.includes(searchTerm) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' || payment.status === filter

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Completado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">Pendiente</Badge>
      case 'failed':
        return <Badge className="bg-red-600 text-white">Fallido</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const pendingCount = payments.filter(p => p.status === 'pending').length
  const completedCount = payments.filter(p => p.status === 'completed').length
  const failedCount = payments.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">Gestión de Pagos</h3>
          <p className="text-muted-foreground">
            Confirma pagos y monitorea el estado de las transacciones
          </p>
        </div>
        <Button
          onClick={fetchPayments}
          variant="outline"
          disabled={loading}
          className="border-white text-white hover:bg-white/10"
        >
          <Search className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
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
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                Pendientes de Confirmación
              </CardTitle>
              <Badge className="bg-yellow-600 text-white">
                {pendingCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pagos en espera de confirmación
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Completados
              </CardTitle>
              <Badge className="bg-green-600 text-white">
                {completedCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pagos confirmados y tickets vendidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Fallidos/Expirados
              </CardTitle>
              <Badge className="bg-red-600 text-white">
                {failedCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pagos fallidos o tickets expirados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono o ID de transacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-white/20 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-white text-black' : 'border-white text-white hover:bg-white/10'}
          >
            Todos
          </Button>
          <Button
            size="sm"
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-yellow-600 text-white' : 'border-yellow-600 text-yellow-400 hover:bg-yellow-600/10'}
          >
            Pendientes
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-green-600 text-white' : 'border-green-600 text-green-400 hover:bg-green-600/10'}
          >
            Completados
          </Button>
          <Button
            size="sm"
            variant={filter === 'failed' ? 'default' : 'outline'}
            onClick={() => setFilter('failed')}
            className={filter === 'failed' ? 'bg-red-600 text-white' : 'border-red-600 text-red-400 hover:bg-red-600/10'}
          >
            Fallidos
          </Button>
        </div>
      </div>

      {/* Payments List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Cargando pagos...</p>
          </CardContent>
        </Card>
      ) : filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all'
                ? 'No se encontraron pagos con los filtros actuales'
                : 'No hay pagos registrados aún'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            return (
              <Card key={payment.id} className={`border-l-4 ${
                payment.status === 'completed' ? 'border-l-green-500' :
                payment.status === 'pending' ? 'border-l-yellow-500' :
                'border-l-red-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Left: Status and Amount */}
                    <div className="md:w-48 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ${payment.amount.toLocaleString()} CLP
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {payment.tickets.length} boleto(s)
                      </div>
                    </div>

                    {/* Middle: User Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{payment.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{payment.user.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {payment.tickets.slice(0, 10).map((ticket) => (
                          <Badge key={ticket.id} variant="outline" className="text-xs">
                            #{ticket.number}
                          </Badge>
                        ))}
                        {payment.tickets.length > 10 && (
                          <Badge variant="outline" className="text-xs">
                            +{payment.tickets.length - 10} más
                          </Badge>
                        )}
                      </div>
                      {payment.transactionId && (
                        <div className="text-xs text-muted-foreground mt-2">
                          ID Transacción: {payment.transactionId}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleString('es-CL')}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:w-40 flex-shrink-0 flex flex-col gap-2">
                      {payment.status === 'pending' && (
                        <Button
                          onClick={() => confirmPayment(payment.id)}
                          disabled={confirming === payment.id}
                          className="w-full bg-green-600 text-white hover:bg-green-700"
                        >
                          {confirming === payment.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Confirmando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirmar Pago
                            </>
                          )}
                        </Button>
                      )}
                      {payment.status === 'completed' && (
                        <div className="text-xs text-green-400 text-center py-2">
                          ✓ Pago confirmado<br/>Tickets vendidos
                        </div>
                      )}
                      {payment.status === 'failed' && (
                        <div className="text-xs text-red-400 text-center py-2">
                          ✗ Pago fallido<br/>Tickets liberados
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            ¿Cómo Confirmar Pagos?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">1</Badge>
            <div>
              <p className="font-semibold">El cliente te contacta por WhatsApp</p>
              <p className="text-muted-foreground">
                "Hola, ya pagué X boletos por $XXX"
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">2</Badge>
            <div>
              <p className="font-semibold">Verifica el comprobante de pago</p>
              <p className="text-muted-foreground">
                Revisa la captura de pantalla de Mercado Pago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">3</Badge>
            <div>
              <p className="font-semibold">Confirma el pago aquí</p>
              <p className="text-muted-foreground">
                Busca el pago por nombre o teléfono y haz clic en "Confirmar Pago"
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600 text-white mt-0.5">4</Badge>
            <div>
              <p className="font-semibold">Los tickets se venden automáticamente</p>
              <p className="text-muted-foreground">
                El nombre del cliente aparecerá en la ruleta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
