# 🚀 Instrucciones de Despliegue - Optimización de Imágenes ML Decants

## 📋 Resumen de cambios

| Archivo | Estado |
|---------|--------|
| `next.config.mjs` | ✅ Modificado - Image Optimization habilitado |
| `components/hero.tsx` | ✅ Modificado - Usa WebP optimizado |
| `public/hero.webp` | ✅ Nuevo - 242 KB |
| `public/hero-Mobil.webp` | ✅ Nuevo - 218 KB |
| `public/hero.png` | ❌ Eliminado (4.3 MB) |
| `public/hero-Mobil.png` | ❌ Eliminado (4.3 MB) |

---

## 🚀 Para desplegar a Vercel

### Opción 1: Usar GitHub CLI (si tienes autenticado)
```bash
cd /ruta/al/proyecto/MLDeconst
git push origin main
```

### Opción 2: Usar credenciales HTTPS
```bash
cd /ruta/al/proyecto/MLDeconst

# Configurar credenciales (llama unas veces)
git remote set-url origin https://<TU-USUARIO>:<TU-TOKEN>@github.com/elpanxitoo/MLDeconst.git

# Hacer push
git push origin main
```

### Opción 3: Usar token de personal access
1. Ve a: https://github.com/settings/tokens
2. Crea un token con permiso `repo`
3. Ejecuta:
```bash
cd /ruta/al/proyecto/MLDeconst
git push https://<TOKEN>@github.com/elpanxitoo/MLDeconst.git main
```

---

## ⚡ Verificación del build local

```bash
# Instalar dependencias
npm install

# Verificar build
npm run build
```

---

## 📊 Resultados esperados

**Antes:**
- Tiempo de carga inicial: ~3-5 segundos
- Tamaño imágenes: 8.6 MB

**Después:**
- Tiempo de carga inicial: <1 segundo
- Tamaño imágenes: ~460 KB
- Reducción: ~95%

---

## 📝 Notas importantes

Vercel desplegará automáticamente al detectar el push a `main`. Puedes verificar el despliegue en: https://ml-decants.vercel.app