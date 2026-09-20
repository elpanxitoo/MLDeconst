#!/bin/bash
# Script to deploy ML Decants optimizations to Vercel
# Run this from your local development environment

echo "=== ML Decants Image Optimization Deployment Script ==="
echo ""
echo "Cambios realizados:"
echo "1. next.config.mjs - Habilitado Image Optimization"
echo "2. components/hero.tsx - Usando imagen WebP optimizada"
echo "3. Imágenes optimizadas: hero.webp (242KB), hero-Mobil.webp (218KB)"
echo ""

# Navigate to repo
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f ".git" ]; then
    echo "Error: Este script debe ejecutarse desde el directorio del repo"
    exit 1
fi

# Add and commit changes
git add -A
git commit -m "feat: optimize hero images for faster load

- Enable Next.js Image Optimization
- Replace 4.3MB PNG with 242KB WebP
- Consolidate to single responsive image
- ~95% reduction in initial load size"

# Push to main
echo ""
echo "Empujando a origin/main..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Éxito! Los cambios se han subido a GitHub"
    echo "Vercel hará el despliegue automáticamente en https://ml-decants.vercel.app"
else
    echo ""
    echo "❌ Error al hacer push. Por favor revisa los errores arriba."
fi