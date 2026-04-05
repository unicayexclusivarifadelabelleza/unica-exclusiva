'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, CheckCircle } from 'lucide-react'

export function CreateRaffleForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ticketPrice, setTicketPrice] = useState<'1000' | '2000' | '3000'>('1000')
  const [maxTickets, setMaxTickets] = useState(50)
  const [prizes1000, setPrizes1000] = useState([
    { name: '', value: 0, imageUrl: '' }
  ])
  const [prizes2000, setPrizes2000] = useState([
    { name: '', value: 0, imageUrl: '' }
  ])
  const [prizes3000, setPrizes3000] = useState([
    { name: '', value: 0, imageUrl: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const addPrize = (priceType: '1000' | '2000' | '3000') => {
    const newPrize = { name: '', value: 0, imageUrl: '' }
    if (priceType === '1000') {
      setPrizes1000([...prizes1000, newPrize])
    } else if (priceType === '2000') {
      setPrizes2000([...prizes2000, newPrize])
    } else if (priceType === '3000') {
      setPrizes3000([...prizes3000, newPrize])
    }
  }

  const removePrize = (priceType: '1000' | '2000' | '3000', index: number) => {
    if (priceType === '1000') {
      setPrizes1000(prizes1000.filter((_, i) => i !== index))
    } else if (priceType === '2000') {
      setPrizes2000(prizes2000.filter((_, i) => i !== index))
    } else if (priceType === '3000') {
      setPrizes3000(prizes3000.filter((_, i) => i !== index))
    }
  }

  const updatePrize = (priceType: '1000' | '2000' | '3000', index: number, field: keyof typeof prizes1000[0], value: string | number) => {
    if (priceType === '1000') {
      const updated = [...prizes1000]
      updated[index][field] = value
      setPrizes1000(updated)
    } else if (priceType === '2000') {
      const updated = [...prizes2000]
      updated[index][field] = value
      setPrizes2000(updated)
    } else if (priceType === '3000') {
      const updated = [...prizes3000]
      updated[index][field] = value
      setPrizes3000(updated)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create raffle
      const raffleResponse = await fetch('/api/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          ticketPrice: parseInt(ticketPrice),
          maxTickets
        })
      })

      const raffleData = await raffleResponse.json()
      
      if (!raffleResponse.ok) {
        throw new Error(raffleData.error || 'Error al crear rifa')
      }

      const raffleId = raffleData.raffle.id

      // Create prizes
      const allPrizes = [
        ...prizes1000.map(p => ({ ...p, priceType: '1000' })),
        ...prizes2000.map(p => ({ ...p, priceType: '2000' })),
        ...prizes3000.map(p => ({ ...p, priceType: '3000' }))
      ]
      
      for (const prize of allPrizes) {
        if (prize.name && prize.value > 0) {
          await fetch('/api/prizes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              raffleId,
              ...prize
            })
          })
        }
      }

      // Initialize tickets
      await fetch('/api/raffles/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raffleId })
      })

      setSuccess(true)
      
      // Reset form after delay
      setTimeout(() => {
        setTitle('')
        setDescription('')
        setPrizes1000([{ name: '', value: 0, imageUrl: '' }])
        setPrizes2000([{ name: '', value: 0, imageUrl: '' }])
        setPrizes3000([{ name: '', value: 0, imageUrl: '' }])
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error creating raffle:', error)
      alert('Error al crear la rifa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Rifa</CardTitle>
        <CardDescription>
          Configura los detalles de la nueva rifa y sus premios
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">¡Rifa creada exitosamente!</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título de la Rifa</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Rifa de Belleza Primavera"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los detalles de esta rifa..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Ticket Configuration */}
          <div className="space-y-4">
            <Label>Categoría de Boleto</Label>
            <div className="flex gap-4">
              {[
                { value: '1000', label: 'Bronce', price: '$1,000' },
                { value: '2000', label: 'Plata', price: '$2,000' },
                { value: '3000', label: 'Oro', price: '$3,000' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTicketPrice(option.value as any)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    ticketPrice === option.value
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.price}</div>
                </button>
              ))}
            </div>
            <div>
              <Label htmlFor="maxTickets">Cantidad de Boletos (Máximo 50 por sorteo)</Label>
              <Input
                id="maxTickets"
                type="number"
                min="10"
                max="50"
                value={maxTickets}
                onChange={(e) => setMaxTickets(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Prizes - Organizados por categoría de boleto */}
          <div className="space-y-6">
            
            {/* Premios $1,000 (BRONCE) */}
            <div className="space-y-3 p-4 border-2 border-amber-600 rounded-lg bg-amber-50/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600 text-white">🥉</Badge>
                  <h4 className="text-lg font-semibold">Premios $1,000 (Bronce)</h4>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPrize('1000')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {prizes1000.map((prize, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Nombre del Premio</Label>
                        <Input
                          value={prize.name}
                          onChange={(e) => updatePrize('1000', index, 'name', e.target.value)}
                          placeholder="Ej: Set de Maquillaje Premium"
                        />
                      </div>
                      <div>
                        <Label>Valor del Premio (COP)</Label>
                        <Input
                          type="number"
                          value={prize.value || ''}
                          onChange={(e) => updatePrize('1000', index, 'value', parseInt(e.target.value) || 0)}
                          placeholder="Ej: 15000"
                        />
                      </div>
                      <div>
                        <Label>URL de Imagen (Opcional)</Label>
                        <Input
                          value={prize.imageUrl || ''}
                          onChange={(e) => updatePrize('1000', index, 'imageUrl', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrize('1000', index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
              {prizes1000.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay premios agregados para la categoría $1,000
                </p>
              )}
            </div>

            {/* Premios $2,000 (PLATA) */}
            <div className="space-y-3 p-4 border-2 border-slate-300 rounded-lg bg-slate-100/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-300 text-white">🥈</Badge>
                  <h4 className="text-lg font-semibold">Premios $2,000 (Plata)</h4>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPrize('2000')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {prizes2000.map((prize, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Nombre del Premio</Label>
                        <Input
                          value={prize.name}
                          onChange={(e) => updatePrize('2000', index, 'name', e.target.value)}
                          placeholder="Ej: Sostén Leonisa"
                        />
                      </div>
                      <div>
                        <Label>Valor del Premio (COP)</Label>
                        <Input
                          type="number"
                          value={prize.value || ''}
                          onChange={(e) => updatePrize('2000', index, 'value', parseInt(e.target.value) || 0)}
                          placeholder="Ej: 20000"
                        />
                      </div>
                      <div>
                        <Label>URL de Imagen (Opcional)</Label>
                        <Input
                          value={prize.imageUrl || ''}
                          onChange={(e) => updatePrize('2000', index, 'imageUrl', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrize('2000', index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
              {prizes2000.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay premios agregados para la categoría $2,000
                </p>
              )}
            </div>

            {/* Premios $3,000 (ORO) */}
            <div className="space-y-3 p-4 border-2 border-yellow-400 rounded-lg bg-yellow-100/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-400 text-white">🥇</Badge>
                  <h4 className="text-lg font-semibold">Premios $3,000 (Oro)</h4>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPrize('3000')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {prizes3000.map((prize, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Nombre del Premio</Label>
                        <Input
                          value={prize.name}
                          onChange={(e) => updatePrize('3000', index, 'name', e.target.value)}
                          placeholder="Ej: Faja Leonisa Premium"
                        />
                      </div>
                      <div>
                        <Label>Valor del Premio (COP)</Label>
                        <Input
                          type="number"
                          value={prize.value || ''}
                          onChange={(e) => updatePrize('3000', index, 'value', parseInt(e.target.value) || 0)}
                          placeholder="Ej: 25000"
                        />
                      </div>
                      <div>
                        <Label>URL de Imagen (Opcional)</Label>
                        <Input
                          value={prize.imageUrl || ''}
                          onChange={(e) => updatePrize('3000', index, 'imageUrl', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrize('3000', index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
              {prizes3000.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay premios agregados para la categoría $3,000
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-background hover:opacity-90"
            size="lg"
          >
            {loading ? 'Creando Rifa...' : 'Crear Rifa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
