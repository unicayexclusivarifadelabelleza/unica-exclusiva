'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Ticket, Check } from 'lucide-react'

interface TicketSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: (tickets: number[], customerData: any) => void
  level?: string
  ticketPrice: number
}

export function TicketSelectorModal({ isOpen, onClose, onConfirm, level, ticketPrice }: TicketSelectorModalProps) {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTickets([])
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
    }
  }, [isOpen])

  const availableTickets = Array.from({ length: 100 }, (_, i) => i + 1)

  const toggleTicket = (ticketNumber: number) => {
    if (selectedTickets.includes(ticketNumber)) {
      setSelectedTickets(selectedTickets.filter(t => t !== ticketNumber))
    } else if (selectedTickets.length < 20) {
      setSelectedTickets([...selectedTickets, ticketNumber])
    }
  }

  const toggleAll = () => {
    if (selectedTickets.length === 20) {
      setSelectedTickets([])
    } else {
      const available = availableTickets.filter(t => !selectedTickets.includes(t))
      const toSelect = available.slice(0, 20 - selectedTickets.length)
      setSelectedTickets([...selectedTickets, ...toSelect])
    }
  }

  const calculateTotal = () => selectedTickets.length * ticketPrice

  const handlePurchase = async () => {
    if (selectedTickets.length === 0) {
      alert('Por favor selecciona al menos un boleto')
      return
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y teléfono')
      return
    }

    if (onConfirm) {
      // Use the callback if provided (for development/testing)
      onConfirm(selectedTickets, {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      })
      return
    }

    setIsPurchasing(true)

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickets: selectedTickets,
          customerName,
          customerPhone,
          customerEmail,
          ticketPrice,
          ticketType: level || 'unknown'
        })
      })

      const data = await response.json()

      if (response.ok && data.paymentUrl) {
        onClose()
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error || 'Error al procesar la compra')
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error)
      alert('Error al procesar la compra. Por favor intenta nuevamente.')
    } finally {
      setIsPurchasing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto bg-card border-white/20 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">
              Selecciona tus Boletos
            </h2>
            <p className="text-muted-foreground">
              {level || 'Rifa'} - ${ticketPrice.toLocaleString()} CLP cada uno
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <CardContent className="space-y-6 overflow-y-auto flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="bg-white text-black border-0 px-4 py-2">
                <Ticket className="w-4 h-4 mr-2" />
                {selectedTickets.length} / 20 seleccionados
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAll}
                className="border-white text-white hover:bg-white/10 ml-2"
              >
                {selectedTickets.length === 20 ? 'Deseleccionar Todos' : 'Seleccionar 20 Aleatorios'}
              </Button>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total a pagar:</p>
              <p className="text-3xl font-bold text-white">
                ${calculateTotal().toLocaleString()} CLP
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white mb-3">
              Selecciona tus números:
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 border border-white/10 rounded-lg">
              {availableTickets.map(ticketNumber => {
                const isSelected = selectedTickets.includes(ticketNumber)
                return (
                  <button
                    key={ticketNumber}
                    type="button"
                    onClick={() => toggleTicket(ticketNumber)}
                    disabled={!isSelected && selectedTickets.length >= 20}
                    className={`relative p-3 rounded-lg border-2 font-bold transition-all ${
                      isSelected
                        ? 'border-white bg-white/10 text-black'
                        : 'border-white/30 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {ticketNumber}
                    {isSelected && (
                      <Check className="absolute top-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 p-4 bg-card/50 rounded-lg">
            <p className="text-sm font-semibold text-white mb-3">
              Tus Datos:
            </p>
            <div>
              <Label htmlFor="name" className="text-white">Nombre Completo *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Tu nombre"
                className="bg-background border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Teléfono (WhatsApp) *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+56 9 XXXX XXXX"
                className="bg-background border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="tu@email.com"
                className="bg-background border-white/20 text-white"
              />
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            💡 Selecciona hasta 20 boletos por compra. Pagos seguros vía Mercado Pago.
          </p>
        </CardContent>

        <div className="p-6 border-t border-white/10 flex-shrink-0 bg-card">
          <Button
            onClick={handlePurchase}
            disabled={selectedTickets.length === 0 || isPurchasing}
            className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 font-bold text-lg py-4 shadow-lg"
          >
            {isPurchasing ? (
              <>Procesando...</>
            ) : (
              <>
                <Ticket className="w-5 h-5 mr-2" />
                Comprar {selectedTickets.length} Boleto{selectedTickets.length !== 1 ? 's' : ''} por ${calculateTotal().toLocaleString()} CLP
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
