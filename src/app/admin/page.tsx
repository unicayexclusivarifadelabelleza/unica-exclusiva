'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RouletteWheel } from '@/components/raffle/roulette-wheel'
import { CreateRaffleForm } from '@/components/admin/create-raffle-form'
import { ImageManagement } from '@/components/admin/image-management'
import { TicketManagement } from '@/components/admin/ticket-management'
import { PaymentManagement } from '@/components/admin/payment-management'
import { Package, Shield, Settings, Crown, Image as ImageIcon, Ticket, DollarSign } from 'lucide-react'

export default function AdminPage() {
  const [showRaffle, setShowRaffle] = useState(true)
  const [raffleId, setRaffleId] = useState('')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20 bg-black/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_principal.jpeg" 
                alt="Única y Exclusiva Rifa de la Belleza"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">Panel de Administración</h1>
                <p className="text-xs text-gray-400">Única y Exclusiva Rifa de la Belleza</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white/10"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-5 mx-auto mb-8">
              <TabsTrigger value="create">Crear Rifa</TabsTrigger>
              <TabsTrigger value="draw">Realizar Sorteo</TabsTrigger>
              <TabsTrigger value="payments">Confirmar Pagos</TabsTrigger>
              <TabsTrigger value="tickets">Gestionar Tickets</TabsTrigger>
              <TabsTrigger value="images">Gestionar Imágenes</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateRaffleForm />
            </TabsContent>

            <TabsContent value="draw">
              <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Realizar Sorteo</CardTitle>
                  <CardDescription>
                    Ejecuta un sorteo para seleccionar ganadores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RouletteWheel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="w-full max-w-5xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-gold" />
                    Gestión de Pagos
                  </CardTitle>
                  <CardDescription>
                    Confirma pagos pendientes y verifica el estado de las transacciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-gold" />
                    Gestión de Tickets
                  </CardTitle>
                  <CardDescription>
                    Libera tickets expirados y monitorea el estado de las reservas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TicketManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <ImageManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
