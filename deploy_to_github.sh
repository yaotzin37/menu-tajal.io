#!/bin/bash
# 🚀 Script de Despliegue para GitHub Pages - Menú Digital TAJAL

echo "🚀 Desplegando Menú Digital TAJAL en GitHub Pages"
echo "==============================================="

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar si git está instalado
if ! command_exists git; then
    echo "❌ Git no está instalado. Instálalo primero:"
    echo "   brew install git  # En macOS"
    echo "   apt install git   # En Ubuntu/Debian"
    exit 1
fi

# Variables de configuración
GITHUB_REPO="https://github.com/yaotzin37/menu-tajal.io.git"
DEPLOY_BRANCH="gh-pages"
BUILD_DIR="deploy/menu-digital"

echo "📋 Verificando estado del repositorio..."

# Verificar si estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📥 Clonando repositorio existente..."
    git clone $GITHUB_REPO temp_repo
    cd temp_repo
    # Configurar el repositorio para hacer push
    git remote set-url origin $GITHUB_REPO
else
    echo "✅ Repositorio local encontrado"
fi

echo "🔧 Preparando archivos para despliegue..."

# Crear estructura de directorios si no existe
mkdir -p $BUILD_DIR/assets/images
mkdir -p $BUILD_DIR/css
mkdir -p $BUILD_DIR/js

# Copiar archivos necesarios
echo "📋 Copiando archivos del menú digital..."
cp src/web/menu_digital.html $BUILD_DIR/index.html 2>/dev/null || echo "⚠️  menú digital no encontrado, usando versión standalone"

# Copiar assets si existen
if [ -d "assets" ]; then
    echo "🎨 Copiando assets..."
    cp -r assets/* $BUILD_DIR/assets/ 2>/dev/null || echo "ℹ️  No hay assets para copiar"
fi

# Copiar imágenes si existen
if [ -d "imagenes" ]; then
    echo "🖼️  Copiando imágenes..."
    cp -r imagenes/* $BUILD_DIR/assets/images/ 2>/dev/null || echo "ℹ️  No hay imágenes para copiar"
fi

# Crear archivo .nojekyll para evitar que Jekyll procese el sitio
touch $BUILD_DIR/.nojekyll

echo ""
echo "📦 Archivos preparados en: $BUILD_DIR/"
echo "📋 Contenido:"
ls -la $BUILD_DIR/

# Cambiar a la rama de despliegue
if git show-ref --verify --quiet refs/heads/$DEPLOY_BRANCH; then
    echo "🔄 Cambiando a rama $DEPLOY_BRANCH..."
    git checkout $DEPLOY_BRANCH
else
    echo "🌿 Creando rama $DEPLOY_BRANCH..."
    git checkout -b $DEPLOY_BRANCH
fi

# Copiar archivos del build al repositorio
echo "📤 Copiando archivos al repositorio..."
cp -r $BUILD_DIR/* . 2>/dev/null || true

# Agregar archivos al git
echo "📝 Agregando archivos a git..."
git add .

# Verificar si hay cambios
if git diff --staged --quiet; then
    echo "ℹ️  No hay cambios para commitear"
else
    # Hacer commit
    echo "💾 Creando commit..."
    git commit -m "🚀 Actualizar menú digital - $(date)"

    # Hacer push
    echo "⬆️  Subiendo cambios a GitHub Pages..."
    if git push origin $DEPLOY_BRANCH; then
        echo ""
        echo "🎉 ¡Despliegue exitoso!"
        echo ""
        echo "🌐 Tu menú digital está disponible en:"
        echo "   https://yaotzin37.github.io/menu-tajal.io/"
        echo ""
        echo "📱 Para conectar con tu sitio principal:"
        echo "   Agrega este enlace en tu sitio web existente:"
        echo "   <a href='/menu-digital/'>Ver Menú Digital</a>"
        echo ""
        echo "🔄 Para futuras actualizaciones:"
        echo "   ./deploy_to_github.sh"
    else
        echo ""
        echo "❌ Error subiendo a GitHub"
        echo "💡 Posibles soluciones:"
        echo "   1. Verifica tus credenciales de GitHub"
        echo "   2. Asegúrate de tener permisos de escritura"
        echo "   3. Revisa la configuración del repositorio"
    fi
fi

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
cd ..
rm -rf temp_repo

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "🎯 Próximos pasos:"
echo "   1. Verifica que el menú funcione en GitHub Pages"
echo "   2. Agrega un enlace desde tu sitio principal"
echo "   3. Comparte la URL pública con tus clientes"
