'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Crown, Ticket, Gift, Sparkles, Users, Shield, Zap, Star, Trophy, Settings, Package, Truck } from 'lucide-react'
import { RouletteWheel } from '@/components/raffle/roulette-wheel'
import { CreateRaffleForm } from '@/components/admin/create-raffle-form'
import { TicketSelectorModal } from '@/components/ticket-selector-modal'
import { PrizesShowcase } from '@/components/prizes-showcase'
import { FAQSection } from '@/components/faq-section'
import { CountdownTimer } from '@/components/raffle/countdown-timer'
import { TermsAndConditions } from '@/components/legal/terms-and-conditions'
import { ClientOnly } from '@/components/client-only'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'1000' | '2000' | '3000'>('1000')
  const [showAdmin, setShowAdmin] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedTicketPrice, setSelectedTicketPrice] = useState(1000)
  const [selectedTicketType, setSelectedTicketType] = useState('Bronce')

  const ticketTiers = [
    {
      price: 1000,
      label: 'Bronce',
      prizeRange: 'Hasta $15,000',
      color: 'from-amber-600 to-amber-800',
      borderColor: 'border-amber-600',
      icon: <Ticket className="w-8 h-8" />,
      examples: [
        'Mascarillas de pestañas',
        'Desmaquillantes Leonisa',
        'Productos de cuidado facial',
        'Labiales y gloss',
        'Accesorios de belleza'
      ]
    },
    {
      price: 2000,
      label: 'Plata',
      prizeRange: '$15,000 - $25,000',
      color: 'from-slate-300 to-slate-500',
      borderColor: 'border-slate-300',
      icon: <Sparkles className="w-8 h-8" />,
      examples: [
        'Sostenes Leonisa',
        'Perfumes Esika',
        'Perfumes Cyzone',
        'Kits de cuidado corporal',
        'Sets de maquillaje'
      ]
    },
    {
      price: 3000,
      label: 'Oro',
      prizeRange: '$25,000+',
      color: 'from-yellow-400 to-yellow-600',
      borderColor: 'border-yellow-400',
      icon: <Crown className="w-8 h-8" />,
      examples: [
        'Brasieres Leonisa',
        'Fajas Leonisa',
        'Perfumes L\'Bel',
        'Conjuntos de lencería',
        'Productos premium'
      ]
    }
  ]

  const openTicketModal = (price: number, type: string) => {
    setShowTicketModal(true)
    setSelectedTicketPrice(price)
    setSelectedTicketType(type)
  }

  const steps = [
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Regístrate',
      description: 'Crea tu cuenta gratis en segundos'
    },
    {
      icon: <Ticket className="w-12 h-12" />,
      title: 'Elige tu boleto',
      description: 'Selecciona el nivel de premio que deseas'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Paga seguro',
      description: 'Pagos protegidos con Mercado Pago'
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: '¡Gana!',
      description: 'Espera el sorteo y sé un ganador'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_principal.jpeg" 
                alt="Única y Exclusiva Rifa de la Belleza"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">Única y Exclusiva</h1>
                <p className="text-sm text-white font-semibold">Rifa de la Belleza</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#premios" className="text-sm hover:text-white transition-colors">Premios</a>
              <a href="#como-funciona" className="text-sm hover:text-white transition-colors">Cómo Funciona</a>
              <a href="#ruleta" className="text-sm hover:text-white transition-colors">Ruleta en Vivo</a>
              <a href="#ganadores" className="text-sm hover:text-white transition-colors">Ganadores</a>
              <a href="#faq" className="text-sm hover:text-white transition-colors">Preguntas Frecuentes</a>
              <Button
                className="bg-white text-black hover:opacity-90"
                onClick={() => openTicketModal(1000, 'Bronce')}
              >
                <Ticket className="w-4 h-4 mr-2" />
                Comprar Boleto
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {showTerms ? (
          <TermsAndConditions />
        ) : showAdmin ? (
          <div className="py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Panel de Administración</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Gestiona las rifas, premios y realiza sorteos
                </p>
              </div>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8">
                  <TabsTrigger value="create">Crear Rifa</TabsTrigger>
                  <TabsTrigger value="draw">Realizar Sorteo</TabsTrigger>
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
              </Tabs>
            </div>
          </div>
        ) : (
          <div>

      {/* Hero Section with Banner - PRIMERO */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="relative rounded-2xl overflow-hidden mb-8 mx-auto max-w-4xl shadow-elegant">
            <img
              src="/portada_hero.jpeg"
              alt="Única y Exclusiva Rifa de la Belleza"
              className="w-full h-auto object-cover"
            />
          </div>
          <Badge className="mb-4 bg-white text-black border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Sorteos Exclusivos en Chile
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Rifa de la Belleza
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Participa en las rifas más exclusivas y gana productos de Leonisa, Esika, Cyzone y L\'Bel. 
            Boletos desde $1,000 con envíos a todo Chile por Starken.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:opacity-90 text-lg px-8"
              onClick={() => openTicketModal(1000, 'Bronce')}
            >
              <Ticket className="w-5 h-5 mr-2" />
              Comprar Ahora
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
              Ver Ganadores
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ClientOnly fallback={
            <div className="bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-white shadow-2xl rounded-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-white">Cargando cuenta regresiva...</p>
            </div>
          }>
            <CountdownTimer
              title="Próximo Sorteo"
              subtitle="Jueves a las 9 PM (Horario Chile)"
            />
          </ClientOnly>
        </div>
      </section>

      {/* Tickets Section */}
      <section id="premios" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Elige tu Nivel de Boleto</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <strong className="text-white">Selecciona UN nivel de boleto</strong> para participar en el sorteo. 
              Por cada nivel, puedes ganar <strong className="text-white">UN premio</strong> dentro del rango de valor indicado.
            </p>
            <div className="mt-4 bg-card/50 rounded-lg p-4 max-w-2xl mx-auto border border-border">
              <p className="text-sm text-white">
                <strong>🎯 Importante:</strong> Al elegir tu sección (Bronce, Plata u Oro), entrarás al sorteo de esa categoría y podrás ganar <strong>UNO de los 10 premios</strong> disponibles en esa sección.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ticketTiers.map((tier) => (
              <Card 
                key={tier.price}
                className={`relative overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                  activeTab === String(tier.price) ? 'ring-2 ring-white shadow-elegant' : ''
                }`}
                onClick={() => setActiveTab(String(tier.price) as any)}
              >
                <CardHeader className={`bg-gradient-to-br ${tier.color} p-6`}>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 bg-black/20 rounded-lg ${tier.color}`}>
                      {tier.icon}
                    </div>
                    <Badge className="bg-black/30 text-white border-0">
                      {tier.label}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <CardTitle className="text-3xl font-bold text-white">
                      ${tier.price.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      por boleto
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-xl">💎</span>
                        <span>PODRÍAS ganar UN premio de valor:</span>
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">{tier.prizeRange}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>✨</span>
                        <span>Ejemplos de premios en este nivel:</span>
                      </p>
                      <ul className="text-sm space-y-1">
                        {tier.examples.map((example, i) => (
                          <li key={i} className="text-muted-foreground flex items-start gap-2">
                            <span className="text-white">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    className={`w-full mt-6 ${tier.price === 3000 ? 'bg-white text-black' : 'bg-primary text-primary-foreground'}`}
                    variant={activeTab === String(tier.price) ? 'default' : 'outline'}
                    onClick={() => openTicketModal(tier.price, tier.label)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Elegir Nivel {tier.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Showcase - NEW SECTION */}
      <section id="premios-destacados" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white text-black border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Premios Exclusivos
            </Badge>
            <h3 className="text-3xl font-bold mb-4">¡Mira los Premios que Podrías Ganar!</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estos son los premios reales de nuestra rifa actual. ¡Elige tu boleto y participa por uno de ellos!
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <ClientOnly fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-white/20 rounded-lg p-6">
                    <div className="h-48 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded mb-2 animate-pulse w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2 animate-pulse w-1/2"></div>
                  </div>
                ))}
              </div>
            }>
              <PrizesShowcase />
            </ClientOnly>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-white text-black hover:opacity-90 text-lg px-8"
              onClick={() => openTicketModal(1000, 'Bronce')}
            >
              <Ticket className="w-5 h-5 mr-2" />
              ¡Quiero Participar por Estos Premios!
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">¿Cómo Funciona?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Participar es muy fácil, sigue estos 4 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className={`p-4 rounded-full ${index % 2 === 0 ? 'bg-white text-black' : 'bg-card border-2 border-white'} mx-auto`}>
                    <div className={index % 2 === 0 ? 'text-background' : 'text-white'}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto border-white/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center">
                    <Truck className="w-10 h-10 text-background" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Envíos por Starken</h3>
                  <p className="text-muted-foreground mb-4">
                    Los premios se envían por Starken Chile a todo el país.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-white" />
                      <span className="text-sm">Envío seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-white" />
                      <span className="text-sm">A todo Chile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-white" />
                      <span className="text-sm">Entrega según ubicación del ganador</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Prizes */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Marcas Participantes</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Productos originales de las mejores marcas de belleza
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Leonisa', description: 'Lencería, fajas y sostenes', logo: '/logo_leonisa_oficial.png' },
              { name: 'Esika', description: 'Perfumes y cosméticos', logo: '/logo_esika_oficial.png' },
              { name: 'Cyzone', description: 'Fragancias y cuidado personal', logo: '/logo_cyzone_oficial.png' },
              { name: "L'Bel", description: 'Perfumes de autor', logo: '/logo_lbel_oficial.png' },
            ].map((brand, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <h4 className="font-semibold mb-2">{brand.name}</h4>
                  <p className="text-sm text-muted-foreground">{brand.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Winners Section */}
      <section id="ganadores" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Últimos Ganadores</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Felicitaciones a nuestros ganadores recientes
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { name: 'María García', prize: 'Sostén Leonisa con Levanta-pecho', ticket: '#45', date: 'Esta semana' },
              { name: 'Ana López', prize: 'Perfume Esika Romance', ticket: '#23', date: 'La semana pasada' },
              { name: 'Carlos Rodríguez', prize: 'Faja Leonisa Controladora', ticket: '#12', date: 'Hace 2 semanas' },
              { name: 'Laura Martínez', prize: 'Perfume L\'Bel Idylle', ticket: '#38', date: 'Hace 3 semanas' },
            ].map((winner, index) => (
              <Card key={index} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-background" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{winner.name}</div>
                  <div className="text-sm text-muted-foreground">{winner.prize}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{winner.ticket}</div>
                  <div className="text-xs text-muted-foreground">{winner.date}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-gold border-0 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4 text-background">
                ¿Listo para ser el próximo ganador?
              </h3>
              <p className="text-background/90 mb-8 max-w-2xl mx-auto text-lg">
                Únete a miles de personas que ya están participando en nuestras rifas exclusivas. 
                ¡Tu suerte está a un boleto de distancia!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-background text-white hover:bg-background/90 text-lg px-8"
                  onClick={() => openTicketModal(1000, 'Bronce')}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Comprar Mi Boleto
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-background text-background hover:bg-background/10 text-lg px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Ver Sorteos Activos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Live Roulette Section */}
      <section id="ruleta" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white text-black border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              En Vivo
            </Badge>
            <h3 className="text-3xl font-bold mb-4">Ruleta de Sorteo</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mira cómo giramos la ruleta y descubrimos a los ganadores en tiempo real
            </p>
          </div>

          <div className="flex justify-center">
            <ClientOnly fallback={
              <div className="w-full max-w-2xl mx-auto border border-white/20 rounded-lg p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
                <p className="text-muted-foreground">Cargando ruleta...</p>
              </div>
            }>
              <RouletteWheel />
            </ClientOnly>
          </div>
        </div>
      </section>

      <FAQSection />

      <TicketSelectorModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        ticketPrice={selectedTicketPrice}
        ticketType={selectedTicketType}
      />
      </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card mt-auto">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-background" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Única y Exclusiva</h4>
                  <p className="text-xs text-muted-foreground">Rifa de la Belleza</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                La plataforma de rifas más exclusiva de belleza con premios increíbles.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Navegación</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#premios" className="hover:text-white transition-colors">Premios</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo Funciona</a></li>
                <li><a href="#ganadores" className="hover:text-white transition-colors">Ganadores</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#terminos" className="hover:text-white transition-colors">Bases del Sorteo</a></li>
                <li><a href="#terminos" className="hover:text-white transition-colors">Política de Entrega</a></li>
                <li><a href="#terminos" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contacto</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>WhatsApp disponible para consultas</li>
                <li>Sorteos en vivo en TikTok</li>
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-white" />
                  Envíos por Starken Chile
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white" />
                  Pagos seguros
                </li>
              </ul>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Única y Exclusiva Rifa de la Belleza. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
