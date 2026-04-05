# Guía de Despliegue en Vercel

## Pasos para Desplegar en Vercel

### 1. Preparación del Repositorio

Asegúrate de que todos los cambios estén commiteados en tu repositorio de Git:

```bash
git add .
git commit -m "Listo para desplegar en Vercel"
git push
```

### 2. Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión con tu cuenta de GitHub
3. Conecta tu repositorio de GitHub a Vercel

### 3. Importar el Proyecto en Vercel

1. En Vercel, haz clic en "Add New Project"
2. Selecciona tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js

### 4. Configurar Variables de Entorno

**IMPORTANTE:** Antes de desplegar, debes configurar la variable de entorno de la base de datos.

En la sección "Environment Variables" de Vercel, agrega:

```
Nombre: DATABASE_URL
Valor: postgresql://postgres.gtvzgfifbfymsdkvejin:!KCBF8c2HFr,9X3@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

Esta variable es CRÍTICA para que la aplicación funcione correctamente.

### 5. Configurar el Despliegue

Vercel detectará automáticamente:

- **Framework:** Next.js
- **Build Command:** `bun run build`
- **Output Directory:** `.next`
- **Install Command:** `bun install`

Si Vercel no detecta automáticamente Bun, puedes configurarlo manualmente:

- **Build Command:** `bun run build`
- **Install Command:** `bun install`
- **Output Directory:** `.next`

### 6. Seleccionar Región

Para mejor rendimiento en Chile, selecciona:
- **Region:** Santiago, Chile (scl1)

### 7. Desplegar

Haz clic en "Deploy" y Vercel construirá y desplegará tu aplicación.

El proceso tomará unos minutos. Vercel te mostrará:
- Progreso de la compilación
- Logs de construcción
- URL del sitio desplegado

### 8. Verificar el Despliegue

Una vez completado el despliegue:

1. Visita la URL proporcionada por Vercel
2. Verifica que la página cargue correctamente
3. Prueba las funcionalidades principales:
   - Comprar boletos
   - Ver premios
   - Ver la ruleta
   - Panel de administración

### 9. Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. En Vercel, ve a "Settings" > "Domains"
2. Agrega tu dominio
3. Sigue las instrucciones para configurar los DNS

### 10. Actualizaciones Futuras

Cada vez que hagas cambios en el código:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel detectará automáticamente el push y realizará un nuevo despliegue.

## Troubleshooting

### Error de Base de Datos

Si ves errores de conexión a la base de datos:
1. Verifica que la variable `DATABASE_URL` esté configurada correctamente en Vercel
2. Asegúrate de que la URL de Supabase sea correcta
3. Verifica que el modo SSL esté habilitado (`sslmode=require`)

### Error de Compilación

Si la compilación falla:
1. Verifica los logs de compilación en Vercel
2. Asegúrate de que `bun run build` funcione localmente
3. Verifica que todas las dependencias estén en package.json

### Errores en Tiempo de Ejecución

Si el sitio carga pero hay errores:
1. Verifica los logs en Vercel Dashboard > Functions
2. Asegúrate de que las variables de entorno estén configuradas
3. Verifica que la base de datos sea accesible

## Variables de Entorno Requeridas

- `DATABASE_URL` - URL de conexión a Supabase PostgreSQL (OBLIGATORIO)

## Comandos Útiles

### Localmente:

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev

# Compilar para producción
bun run build

# Ejecutar en producción local
bun run start
```

### En Vercel:

Los despliegues son automáticos cuando haces push a tu repositorio.

## Soporte

Si tienes problemas con el despliegue:
1. Revisa los logs de Vercel
2. Consulta la documentación de Vercel: https://vercel.com/docs
3. Verifica que todas las variables de entorno estén configuradas
