'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Ticket, Sparkles, Crown, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import CountdownTimer from '@/components/countdown-timer'
import PrizesShowcase from '@/components/prizes-showcase'
import RouletteWheel from '@/components/roulette-wheel'
import TicketSelectorModal from '@/components/ticket-selector-modal'

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedTicketLevel, setSelectedTicketLevel] = useState<'bronce' | 'plata' | 'oro' | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  // Set target date only on client side to prevent hydration mismatch
  useEffect(() => {
    setTargetDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  }, [])

  const raffleLevels = [
    {
      id: 'bronce',
      name: 'Nivel Bronce',
      price: 1000,
      color: '#CD7F32',
      icon: Ticket,
      description: 'Participa en sorteos de productos de cuidado básico',
      prizeExamples: ['Shampoo', 'Acondicionador', 'Jabón'],
    },
    {
      id: 'plata',
      name: 'Nivel Plata',
      price: 2000,
      color: '#C0C0C0',
      icon: Sparkles,
      description: 'Participa en sorteos de productos premium',
      prizeExamples: ['Sérum', 'Crema facial', 'Mascarilla'],
    },
    {
      id: 'oro',
      name: 'Nivel Oro',
      price: 3000,
      color: '#FFD700',
      icon: Crown,
      description: 'Participa en sorteos de productos exclusivos y sets completos',
      prizeExamples: ['Set completo', 'Producto exclusivo', 'Paquete premium'],
    },
  ] as const

  const handleBuyTickets = (level: 'bronce' | 'plata' | 'oro') => {
    setSelectedTicketLevel(level)
    setIsTicketModalOpen(true)
  }

  const handleTicketReservation = async (ticketNumbers: number[], customerData: any) => {
    try {
      const response = await fetch('/api/reserve-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketNumbers,
          customerName: customerData.name,
          customerPhone: customerData.phone,
          customerEmail: customerData.email,
          level: selectedTicketLevel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al reservar los boletos')
      }

      toast.success('¡Boletos reservados con éxito! Te hemos enviado los detalles por correo.')
      setIsTicketModalOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reservar los boletos')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Única y Exclusiva
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#premios" className="text-sm font-medium hover:text-primary transition-colors">
                Premios
              </a>
              <a href="#niveles" className="text-sm font-medium hover:text-primary transition-colors">
                Niveles
              </a>
              <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
                ¿Cómo Funciona?
              </a>
              <Button
                onClick={() => handleBuyTickets('oro')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Comprar Boletos
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="#premios" className="text-sm font-medium hover:text-primary transition-colors">
                Premios
              </a>
              <a href="#niveles" className="text-sm font-medium hover:text-primary transition-colors">
                Niveles
              </a>
              <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
                ¿Cómo Funciona?
              </a>
              <Button
                onClick={() => handleBuyTickets('oro')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Comprar Boletos
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🔥 ¡Rifa Abierta!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Rifa de la Belleza
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Participa y gana productos de belleza premium de las mejores marcas. 
            Tres niveles de participación para adaptarse a tu presupuesto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => handleBuyTickets('oro')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Crown className="mr-2 h-5 w-5" />
              Comenzar a Jugar
            </Button>
          </div>

          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto">
            {targetDate && <CountdownTimer targetDate={targetDate} />}
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Roulette Wheel Section */}
      <section id="niveles" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ruleta de la Suerte</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gira la ruleta y descubre tu nivel de participación. ¡Cada nivel tiene premios increíbles!
            </p>
          </div>

          <Tabs defaultValue="bronce" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bronce" className="text-base">
                <Ticket className="mr-2 h-4 w-4" />
                Bronce
              </TabsTrigger>
              <TabsTrigger value="plata" className="text-base">
                <Sparkles className="mr-2 h-4 w-4" />
                Plata
              </TabsTrigger>
              <TabsTrigger value="oro" className="text-base">
                <Crown className="mr-2 h-4 w-4" />
                Oro
              </TabsTrigger>
            </TabsList>

            {raffleLevels.map((level) => (
              <TabsContent key={level.id} value={level.id} className="mt-0">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <Card className="border-2" style={{ borderColor: level.color }}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: level.color + '20' }}>
                            <level.icon className="h-6 w-6" style={{ color: level.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{level.name}</CardTitle>
                            <CardDescription>{level.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          ${level.price.toLocaleString('es-CL')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {level.prizeExamples.map((prize, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <span className="mr-2">✨</span>
                            {prize}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleBuyTickets(level.id as 'bronce' | 'plata' | 'oro')}
                        className="w-full"
                        style={{ backgroundColor: level.color }}
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Comprar Boletos de {level.name}
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <RouletteWheel level={level.id as 'bronce' | 'plata' | 'oro'} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="premios" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premios Disponibles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los increíbles productos que puedes ganar en nuestra rifa de belleza.
            </p>
          </div>

          <PrizesShowcase />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Participar es muy sencillo. Sigue estos 3 simples pasos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Elige tu Nivel',
                description: 'Selecciona entre los niveles Bronce ($1.000), Plata ($2.000) u Oro ($3.000) según tus preferencias.',
              },
              {
                step: '2',
                title: 'Compra tus Boletos',
                description: 'Elige tus números de boletos y completa el formulario de registro. El pago es seguro a través de Mercado Pago.',
              },
              {
                step: '3',
                title: '¡Espera el Sorteo!',
                description: 'El día del sorteo, giraremos la ruleta y anunciaremos a los ganadores. ¡Podrías ser tú!',
              },
            ].map((item, index) => (
              <Card key={index} className="text-center border-2 border-dashed">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Única y Exclusiva</span>
              </div>
              <p className="text-muted-foreground">
                La plataforma de rifas de belleza más exclusiva de Chile.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#premios" className="hover:text-primary transition-colors">
                    Premios
                  </a>
                </li>
                <li>
                  <a href="#niveles" className="hover:text-primary transition-colors">
                    Niveles
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-primary transition-colors">
                    ¿Cómo Funciona?
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>📧 contacto@unicayexclusiva.cl</li>
                <li>📱 +56 9 1234 5678</li>
                <li>📍 Santiago, Chile</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Única y Exclusiva. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Ticket Selector Modal */}
      <TicketSelectorModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onConfirm={handleTicketReservation}
        level={selectedTicketLevel}
        ticketPrice={selectedTicketLevel ? raffleLevels.find(l => l.id === selectedTicketLevel)!.price : 0}
      />

      {/* Toaster */}
      <Toaster />
    </div>
  )
}
