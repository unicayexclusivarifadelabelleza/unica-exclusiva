'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Crown, Shield, Package, Clock, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react'

export function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <Card className="mb-8 border-white/30">
        <CardHeader>
          <CardTitle className="text-3xl">Términos y Condiciones</CardTitle>
          <CardDescription>
            Última actualización: Enero 2025
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Header */}
          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-black flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Rifa de la Belleza - Chile
                </h3>
                <p className="text-muted-foreground">
                  Plataforma de sorteos de productos de belleza con envíos a todo Chile.
                  Los sorteos se realizan en vivo los jueves a las 21:00 horas.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 1: Participación */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              1. Participación
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>Debes ser mayor de 18 años para participar</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>Válido solo para residentes en Chile continental</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>Un boleto da derecho a un número único de sorteo</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>Los boletos son personales e intransferibles</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>¡No hay límite de boletos por persona! Compra los que quieras.</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 2: Sorteos */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              2. Sorteos en Vivo
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Badge className="bg-white text-black border-0 flex-shrink-0 mt-0.5">
                  Jueves 21:00
                </Badge>
                <p>Los sorteos se realizan en vivo los jueves a las 21:00 horas (horario Chile)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-white text-black border-0 flex-shrink-0 mt-0.5">
                  Orden
                </Badge>
                <p>
                  Primero se sortean los premios de $1,000, luego los de $2,000, 
                  y finalmente los de $3,000
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-white text-black border-0 flex-shrink-0 mt-0.5">
                  Transparencia
                </Badge>
                <p>
                  Si el ganador está presente en el live, se anuncia en vivo.
                  Si no está presente, se llama por teléfono frente a público.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-white text-black border-0 flex-shrink-0 mt-0.5">
                  Testigos
                </Badge>
                <p>
                  Todos los sorteos quedan grabados y disponibles para revisión en TikTok
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 3: Premios y Categorías */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" />
              3. Premios y Categorías
            </h4>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h5 className="font-semibold mb-3">Boletos de $1,000 (Bronce)</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mascarillas de pestañas</li>
                  <li>• Desmaquillantes</li>
                  <li>• Productos de cuidado facial</li>
                  <li>• Labiales y gloss</li>
                  <li>• Accesorios de belleza</li>
                  <li>• Productos interiores Leonisa</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h5 className="font-semibold mb-3">Boletos de $2,000 (Plata)</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sostenes Leonisa</li>
                  <li>• Perfumes Esika</li>
                  <li>• Perfumes Cyzone</li>
                  <li>• Kits de cuidado corporal</li>
                  <li>• Sets de maquillaje</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h5 className="font-semibold mb-3">Boletos de $3,000 (Oro)</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Brasieres Leonisa</li>
                  <li>• Fajas Leonisa</li>
                  <li>• Perfumes L'Bel</li>
                  <li>• Conjuntos de lencería</li>
                  <li>• Productos premium</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 4: Entrega de Premios */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" />
              4. Entrega de Premios
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Empresa de envío:</strong> Starken Chile
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Cobertura:</strong> Todo Chile continental
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Entrega:</strong> Los premios se envían los sábados.
                  Llegarán al ganador según su ubicación en Chile.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Límite de reclamo:</strong> Hasta el miércoles anterior al siguiente sorteo
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 5: Reclamo de Premios */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              5. Proceso de Reclamo
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-white/10 border border-white/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 text-amber-600">Plazos Importantes</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>El ganador tiene hasta el miércoles para reclamar su premio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>El ganador elige su premio entre 10 opciones disponibles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Si no reclama, el premio se acumula para el próximo sorteo</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  Contactamos al ganador por WhatsApp para coordinar la elección de premio
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  Publicamos evidencias en el grupo de WhatsApp y en la plataforma
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 6: Cómo Funciona y Encuesta */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              6. Preguntas Frecuentes
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Quién puede participar?</h5>
                <p className="text-sm mb-2">
                  Cualquier persona mayor de 18 años y residente en Chile continental.
                  ¡NO hay límite de boletos! Compra los que quieras.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Cómo elijo mi número de boleto?</h5>
                <p className="text-sm mb-2">
                  Al comprar un boleto, podrás elegir tu número favorito.
                  Tu nombre y número se agregarán a la rueda del sorteo.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Cuándo se realizan los sorteos?</h5>
                <p className="text-sm mb-2">
                  Todos los jueves a las 21:00 horas en vivo (TikTok).
                  Primero $1,000, luego $2,000, finalmente $3,000.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Cuántos premios hay?</h5>
                <p className="text-sm mb-2">
                  Por cada 50 boletos vendidos se sortean 3 ganadores.
                  Si se venden menos de 50, hay menos premios (1 o 2 según corresponda).
                  Si se venden más, aumentan los premios proporcionalmente.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Cómo recibo mi premio?</h5>
                <p className="text-sm mb-2">
                  El sábado siguiente al sorteo enviamos los premios.
                  Llegan al ganador según su ubicación.
                  Contactamos por WhatsApp para coordinar la entrega.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h5 className="font-semibold mb-3">¿Qué pasa si no reclamo a tiempo?</h5>
                <p className="text-sm mb-2">
                  Tienes hasta el miércoles anterior al siguiente sorteo para reclamar.
                  Si no reclamas, el premio se acumula para el próximo sorteo.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Sección 7: Pagos */}
          <section>
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              7. Pagos
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  Pagos seguros a través de pasarela en línea
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>
                  El boleto se activa inmediatamente después del pago confirmado
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p>
                  No hay reembolsos una vez comprado el boleto
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 p-6 bg-white/10 rounded-lg border border-white/20">
            <p className="text-sm text-muted-foreground mb-4">
              Al participar en la rifa, aceptas estos términos y condiciones.
              Nos reservamos el derecho de modificar estos términos con previo aviso.
            </p>
            <div className="flex items-start gap-2">
              <Crown className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                <strong>¿Dudas?</strong> Contáctanos por WhatsApp
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
