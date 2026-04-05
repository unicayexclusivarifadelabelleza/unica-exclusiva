'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: string
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    title: '🎫 Sobre las Rifas',
    icon: 'raffles',
    items: [
      {
        id: 'r1',
        question: '¿Cómo participo en la rifa?',
        answer: 'Es muy fácil: 1) Haz clic en "Comprar Boleto", 2) Selecciona tu número de boleto, 3) Completa tus datos (nombre y teléfono), 4) Paga con Mercado Pago, 5) ¡Listo! Ya estás participando. Los boletos se marcan automáticamente y entran en el sorteo.'
      },
      {
        id: 'r2',
        question: '¿Cuántos boletos puedo comprar?',
        answer: 'Puedes comprar hasta 20 boletos por transacción. Si quieres más, puedes hacer múltiples compras. Cada boleto es una oportunidad extra de ganar. Recomendamos comprar varios para aumentar tus posibilidades.'
      },
      {
        id: 'r3',
        question: '¿Cuándo son los sorteos?',
        answer: 'Los sorteos se realizan cada JUEVES a las 9:00 PM (hora de Chile). Después del sorteo, publicaremos los resultados esa misma noche. También mostramos un contador de tiempo restante en la página.'
      },
      {
        id: 'r4',
        question: '¿Cómo funciona el sistema de números?',
        answer: 'Cada rifa tiene 100 boletos numerados del 1 al 100. Cuando seleccionas un número, ese boleto se marca como vendido y solo puede tener un dueño. En el sorteo, se gira una ruleta que elige al ganador entre los boletos vendidos.'
      }
    ]
  },
  {
    title: '💳 Sobre Pagos',
    icon: 'payments',
    items: [
      {
        id: 'p1',
        question: '¿Cómo pago mi boleto?',
        answer: 'El pago es súper seguro a través de Mercado Pago. Después de seleccionar tus boletos y llenar tus datos, el sistema te redirige a Mercado Pago donde puedes pagar con: tarjeta de crédito/débito, dinero en cuenta, WebPay, o en efectivo en puntos de pago como Ripley o Servipag.'
      },
      {
        id: 'p2',
        question: '¿Es seguro pagar con Mercado Pago?',
        answer: '¡Absolutamente sí! Mercado Pago es la plataforma de pagos más segura de Latinoamérica. Toda tu información está protegida con encriptación de nivel bancario. Nosotros nunca vemos tus datos de tarjeta. Es 100% seguro.'
      },
      {
        id: 'p3',
        question: '¿Qué pasa si no me carga el pago?',
        answer: 'Si el pago no carga, intenta: 1) Recargar la página, 2) Usar otro navegador (Chrome, Firefox), 3) Desactivar ad-blockers temporales, 4) Verificar tu conexión a internet. Si persiste, contáctanos por WhatsApp y te ayudamos.'
      },
      {
        id: 'p4',
        question: '¿Hay devoluciones si me arrepiento?',
        answer: 'Una vez que se selecciona un número de boleto, NO se pueden hacer devoluciones porque ese número queda reservado para ti y no puede ser vendido a otra persona. Por favor, asegúrate antes de comprar. Los pagos ya hechos no son reembolsables.'
      }
    ]
  },
  {
    title: '🎁 Sobre Premios',
    icon: 'prizes',
    items: [
      {
        id: 'pr1',
        question: '¿Qué marcas de productos se rifan?',
        answer: 'Rifamos productos de las mejores marcas de belleza: LEONISA (lencería, fajas, sostenes), ESIKA (maquillaje, perfumes, cuidado facial), CYZONE (cosméticos, cuidado personal) y L\'BEL (perfumes, cosméticos premium). Todos productos 100% originales y nuevos.'
      },
      {
        id: 'pr2',
        question: '¿Cuánto valen los premios?',
        answer: 'Depende del tipo de boleto: 🥉 BRONCE ($1.000): premios hasta $15.000, 🥈 PLATA ($2.000): premios de $15.000 a $25.000, 🥇 ORO ($3.000): premios de $25.000 en adelante. ¡Más pagas, mejores chances de premios más grandes!'
      },
      {
        id: 'pr3',
        question: '¿Son productos nuevos o usados?',
        answer: '¡TODOS los premios son 100% nuevos, sellados y originales! Nunca rifamos productos usados, abiertos o dañados. Recibes tu premio en perfectas condiciones, listo para usar. Garantía de calidad garantizada.'
      }
    ]
  },
  {
    title: '📦 Sobre Envíos',
    icon: 'shipping',
    items: [
      {
        id: 'e1',
        question: '¿Cómo recibo mi premio si gano?',
        answer: 'Si eres ganador, te contactamos por WhatsApp y teléfono que nos diste al comprar. Coordinamos contigo el envío. Los premios se envían por STARKEN a todo Chile. Tú solo tienes que esperar que llegue a tu ciudad y puedes retirarlo en la sucursal más cercana.'
      },
      {
        id: 'e2',
        question: '¿Los envíos son gratis?',
        answer: '¡SÍ! Los envíos de los premios son GRATIS para todos los ganadores. Nosotros nos encargamos de cubrir el costo del envío por Starken a cualquier punto de Chile. No tienes que pagar nada extra por recibir tu premio.'
      },
      {
        id: 'e3',
        question: '¿A qué zona llegan los envíos?',
        answer: '¡A TODO CHILE! Enviamos por Starken que tiene cobertura nacional. Desde Arica hasta Punta Arenas, incluyendo Isla de Pascua. Llegamos a cualquier ciudad, pueblo o localidad de Chile donde Starken tenga servicio.'
      },
      {
        id: 'e4',
        question: '¿Cuánto tiempo tarda el envío?',
        answer: 'El tiempo depende de tu ubicación: Región Metropolitana: 2-3 días hábiles. Regiones cercanas: 3-5 días hábiles. Regiones del sur: 5-7 días hábiles. Zonas extremas: 7-10 días hábiles. Te enviaremos el número de seguimiento.'
      }
    ]
  },
  {
    title: '🏆 Sobre Ganadores',
    icon: 'winners',
    items: [
      {
        id: 'w1',
        question: '¿Cómo sé si gané?',
        answer: 'Te contactamos inmediatamente después del sorteo por: 1) WhatsApp al número que diste, 2) Llamada telefónica, 3) También publicamos a los ganadores en nuestra página y redes sociales. Si no te contactamos en 24h, probablemente no ganaste, pero siempre puedes verificar con nosotros.'
      },
      {
        id: 'w2',
        question: '¿Me notificarán si gano?',
        answer: '¡Definitivamente SÍ! Nosotros nos comunicamos con todos los ganadores. Es importante que: 1) El teléfono que distes al comprar sea correcto y esté activo, 2) Revises tus WhatsApp regularmente, 3) Respondas cuando te contactemos. Si no podemos contactarte en 48h, podrías perder el premio.'
      },
      {
        id: 'w3',
        question: '¿Dónde veo a los ganadores anteriores?',
        answer: 'Todos los ganadores anteriores se publican en nuestra sección de "Ganadores" en la página. También compartimos en nuestras redes sociales (Facebook, Instagram). Allí puedes ver fotos de los ganadores con sus premios, lo que demuestra que los sorteos son 100% reales y transparentes.'
      },
      {
        id: 'w4',
        question: '¿Puedo participar si ya gané antes?',
        answer: '¡Por supuesto! NO hay límite de veces que puedes participar. Si ya ganaste, puedes seguir participando en sorteos futuros. Cada sorteo es independiente. Muchos de nuestros clientes han ganado varias veces. ¡Sigue participando!'
      }
    ]
  },
  {
    title: '📱 Contacto',
    icon: 'contact',
    items: [
      {
        id: 'c1',
        question: '¿Cómo puedo contactarte si tengo más preguntas?',
        answer: 'Estamos aquí para ayudarte. Puedes contactarnos de varias formas: 1) WhatsApp: +56 9 7281 3770 (rápido, preferido), 2) En la página hay un botón de WhatsApp flotante, 3) Mensaje directo en Instagram/Facebook. Respondemos lo más rápido posible (generalmente en pocas horas).'
      }
    ]
  }
]

export function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const toggleCategory = (categoryIndex: number) => {
    const category = faqCategories[categoryIndex]
    const allExpanded = new Set(expandedItems)
    
    const allCategoryIds = category.items.map(item => item.id)
    const allAreExpanded = allCategoryIds.every(id => allExpanded.has(id))
    
    if (allAreExpanded) {
      allCategoryIds.forEach(id => allExpanded.delete(id))
    } else {
      allCategoryIds.forEach(id => allExpanded.add(id))
    }
    
    setExpandedItems(allExpanded)
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  return (
    <section id="faq" className="py-16 px-4 bg-card/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Buscar preguntas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-background border border-white/20 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => (
            <Card key={category.title} className="border-white/20">
              <CardHeader 
                className="cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleCategory(categoryIndex)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {category.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                  >
                    {category.items.every(item => expandedItems.has(item.id)) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.id} className="border-b border-white/10 last:border-0">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left py-4 px-2 hover:bg-white/5 rounded transition-colors focus:outline-none focus:bg-white/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-white mb-2">
                              {item.question}
                            </p>
                            {expandedItems.has(item.id) && (
                              <p className="text-muted-foreground leading-relaxed">
                                {item.answer}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron preguntas que coincidan con tu búsqueda.
            </p>
            <p className="text-muted-foreground mt-2">
              Intenta con otros términos o contáctanos por WhatsApp.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            ¿Tienes más preguntas?{' '}
            <a
              href="https://wa.me/56972813770"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-semibold"
            >
              Contáctanos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
