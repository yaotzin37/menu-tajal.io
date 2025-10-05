#!/bin/bash
# 📦 Preparar estructura correcta para GitHub Pages

echo "📦 Preparando estructura correcta para GitHub Pages"
echo "================================================="

# Crear directorio para el repositorio preparado
REPO_DIR="menu-tajal-github-pages"

echo "🏗️  Creando estructura de directorios..."
mkdir -p "$REPO_DIR"
cd "$REPO_DIR"

# Crear archivo .nojekyll (imprescindible para GitHub Pages)
echo "📄 Creando .nojekyll..."
touch .nojekyll

# Copiar menú digital a la raíz
echo "📋 Copiando menú digital..."
cp ../index.html ./index.html

# Crear carpeta de assets si existe
if [ -d "../assets" ]; then
    echo "🎨 Copiando assets..."
    cp -r ../assets . 2>/dev/null || echo "ℹ️  No hay assets para copiar"
fi

# Crear README con instrucciones
echo "📝 Creando README..."
cat > README.md << 'EOF'
# 🍽️ Menú Digital TAJAL - GitHub Pages

Este repositorio contiene el menú digital de TAJAL Restaurante & Mixología optimizado para GitHub Pages.

## 🌐 URL Pública
https://yaotzin37.github.io/menu-tajal.io/

## 📋 Características
- ✅ Menú digital completo con datos incluidos
- ✅ Carrito de compras funcional
- ✅ Integración con WhatsApp para pedidos
- ✅ Responsive para móviles y tablets
- ✅ Funciona completamente independiente

## 🚀 Uso
1. Sube todos los archivos a la raíz del repositorio
2. El menú estará disponible automáticamente en la URL pública
3. Comparte la URL con tus clientes

## 📁 Estructura de Archivos
```
menu-tajal.io/
├── index.html     ← Menú digital principal
├── assets/        ← Imágenes y recursos
│   └── images/
└── .nojekyll      ← Evita procesamiento Jekyll
```

## 🔄 Actualizaciones
Para actualizar el menú:
1. Edita el archivo `index.html`
2. Haz commit y push
3. Los cambios aparecerán automáticamente en la URL pública
EOF

echo ""
echo "✅ Estructura preparada correctamente en: $REPO_DIR/"
echo ""
echo "📋 Archivos incluidos:"
ls -la

echo ""
echo "🎯 Para subir a GitHub:"
echo "   1. Ve a https://github.com/yaotzin37/menu-tajal.io"
echo "   2. Sube/reemplaza los archivos en la raíz"
echo "   3. El menú funcionará en: https://yaotzin37.github.io/menu-tajal.io/"

echo ""
echo "💡 Consejo: Puedes arrastrar todos los archivos"
echo "   desde la carpeta '$REPO_DIR/' directamente a GitHub"
