# Resumen Rápido de Despliegue en Vercel

## 🚀 Pasos Esenciales

### 1. Variables de Entorno (CRÍTICO)

En Vercel, configura ESTA variable obligatoriamente:

```
DATABASE_URL = postgresql://postgres.gtvzgfifbfymsdkvejin:!KCBF8c2HFr,9X3@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**⚠️ SIN ESTA VARIABLE, LA APLICACIÓN NO FUNCIONARÁ**

### 2. Configuración de Build en Vercel

Vercel debería detectar automáticamente:
- **Framework:** Next.js
- **Build Command:** `bun run build`
- **Output Directory:** `.next`
- **Install Command:** `bun install`

Si no, configúralo manualmente.

### 3. Región Recomendada

Selecciona: **Santiago, Chile (scl1)** para mejor rendimiento.

### 4. Archivos Configurados

✅ `vercel.json` - Configuración de Vercel
✅ `.vercelignore` - Archivos a ignorar
✅ `package.json` - Scripts actualizados
✅ `prisma/schema.prisma` - Base de datos configurada
✅ `next.config.ts` - Configuración de Next.js (standalone output)

## 📋 Checklist Antes de Desplegar

- [ ] Código commiteado en GitHub
- [ ] Variable DATABASE_URL configurada en Vercel
- [ ] Región seleccionada (Santiago, Chile)
- [ ] Build command verificado
- [ ] Output directory correcto (.next)

## 🔍 Después del Despliegue

### Verificar que funcione:

1. **Página principal:** Debería mostrar "Única y Exclusiva Rifa de la Belleza"
2. **Comprar boletos:** El modal debería abrirse
3. **Ver premios:** Los premios deberían cargarse desde la base de datos
4. **Ruleta:** Debería mostrar participantes
5. **Panel de admin:** Accede a `/admin` para gestionar la rifa

### URLs Importantes

- **Página principal:** `https://tu-dominio.vercel.app/`
- **Panel de admin:** `https://tu-dominio.vercel.app/admin`

## 🐛 Solución de Problemas

### Error: "Database connection failed"

**Causa:** Variable DATABASE_URL no configurada o incorrecta.

**Solución:**
1. Ve a Vercel Dashboard > Settings > Environment Variables
2. Agrega la variable DATABASE_URL con el valor exacto de arriba
3. Re-deploy la aplicación

### Error: "Prisma Client not generated"

**Causa:** El cliente de Prisma no se generó durante el build.

**Solución:** Ya está solucionado con el script `postinstall` en package.json.

### Error: "Page not found"

**Causa:** El build no se completó correctamente.

**Solución:**
1. Verifica los logs de build en Vercel
2. Asegúrate de que no haya errores de compilación

### La página carga pero no muestra contenido

**Causa:** La base de datos no es accesible.

**Solución:**
1. Verifica DATABASE_URL
2. Verifica que la base de datos de Supabase esté activa
3. Verifica que la dirección IP esté permitida en Supabase

## 📊 Funcionalidades Verificadas

✅ Base de datos conectada (Supabase PostgreSQL)
✅ Prisma generando cliente automáticamente
✅ Build de Next.js exitoso
✅ Todos los API routes configurados
✅ Sistema de reservas de tickets
✅ Sistema de pagos (pendiente de confirmar webhook)
✅ Ruleta con filtro por nivel (Bronce/Plata/Oro)

## 🎯 Próximos Pasos

1. **Desplegar en Vercel** siguiendo los pasos de arriba
2. **Configurar webhook de Mercado Pago** (si aún no está configurado)
3. **Probar el flujo completo:**
   - Registro de usuario
   - Compra de boleto
   - Pago
   - Aparición en ruleta
4. **Configurar dominio personalizado** (opcional)

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que DATABASE_URL esté correcta
3. Consulta el archivo `DEPLOYMENT.md` para más detalles

## 🔐 Variables de Entorno Adicionales (Opcionales)

Para el futuro, podrías agregar:
- `MERCADO_PAGO_ACCESS_TOKEN` - Token de acceso a Mercado Pago
- `MERCADO_PAGO_WEBHOOK_SECRET` - Secreto para validar webhooks
- `NEXTAUTH_SECRET` - Secreto para NextAuth.js (si usas autenticación)

Por ahora, solo `DATABASE_URL` es **OBLIGATORIO**.
