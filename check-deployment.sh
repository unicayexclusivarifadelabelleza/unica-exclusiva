#!/bin/bash

echo "🚀 Verificando preparación para despliegue en Vercel..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Database URL
echo "1. Verificando DATABASE_URL..."
if [ -f ".env" ]; then
    if grep -q "DATABASE_URL" .env; then
        if grep -q "postgresql://" .env; then
            echo -e "${GREEN}✓${NC} DATABASE_URL encontrada y configurada con PostgreSQL"
        else
            echo -e "${RED}✗${NC} DATABASE_URL encontrada pero no usa PostgreSQL"
        fi
    else
        echo -e "${RED}✗${NC} DATABASE_URL no encontrada en .env"
    fi
else
    echo -e "${YELLOW}⚠${NC} Archivo .env no encontrado (esto está bien para Vercel)"
fi
echo ""

# Check 2: vercel.json
echo "2. Verificando vercel.json..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json existe"
else
    echo -e "${RED}✗${NC} vercel.json no encontrado"
fi
echo ""

# Check 3: package.json
echo "3. Verificando package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json existe"
    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✓${NC} Script 'build' encontrado"
    fi
    if grep -q '"postinstall"' package.json; then
        echo -e "${GREEN}✓${NC} Script 'postinstall' encontrado (Prisma auto-generate)"
    fi
else
    echo -e "${RED}✗${NC} package.json no encontrado"
fi
echo ""

# Check 4: Prisma schema
echo "4. Verificando Prisma..."
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✓${NC} Schema de Prisma existe"
    if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
        echo -e "${GREEN}✓${NC} Configuración de PostgreSQL encontrada"
    fi
else
    echo -e "${RED}✗${NC} Schema de Prisma no encontrado"
fi
echo ""

# Check 5: Next.js config
echo "5. Verificando Next.js..."
if [ -f "next.config.ts" ]; then
    echo -e "${GREEN}✓${NC} next.config.ts existe"
    if grep -q 'output: "standalone"' next.config.ts; then
        echo -e "${GREEN}✓${NC} Configuración 'standalone' encontrada (óptima para Vercel)"
    fi
else
    echo -e "${RED}✗${NC} next.config.ts no encontrado"
fi
echo ""

# Check 6: Test build
echo "6. Probando compilación..."
echo "   Ejecutando: bun run build"
if bun run build > /tmp/build-test.log 2>&1; then
    echo -e "${GREEN}✓${NC} Compilación exitosa"
else
    echo -e "${RED}✗${NC} Error en la compilación. Revisa /tmp/build-test.log"
    tail -20 /tmp/build-test.log
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Verificación completa!${NC}"
echo ""
echo "📝 Próximos pasos:"
echo "1. Asegúrate de tener un repositorio en GitHub"
echo "2. Sube el código: git add . && git commit -m 'Ready for Vercel' && git push"
echo "3. Ve a vercel.com e importa tu proyecto"
echo "4. Configura la variable DATABASE_URL en Vercel:"
echo "   DATABASE_URL = postgresql://postgres.gtvzgfifbfymsdkvejin:!KCBF8c2HFr,9X3@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
echo "5. Selecciona la región: Santiago, Chile (scl1)"
echo "6. Haz clic en Deploy"
echo ""
echo "📚 Para más información, lee VERCEL_DEPLOY_GUIDE.md"
echo ""
