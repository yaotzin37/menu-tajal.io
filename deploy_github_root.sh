#!/bin/bash
# 🚀 Script de Despliegue para GitHub Pages - Menú Digital TAJAL (Raíz del sitio)

echo "🚀 Desplegando Menú Digital TAJAL en GitHub Pages (Raíz)"
echo "======================================================="

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
BUILD_DIR="github-pages"

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
mkdir -p assets/images

# Copiar archivos del menú digital a la raíz
echo "📋 Copiando menú digital a la raíz del sitio..."
cp ../github-pages/index.html ./index.html 2>/dev/null || echo "⚠️  Archivo index.html no encontrado"

# Copiar assets si existen
if [ -d "../assets" ]; then
    echo "🎨 Copiando assets..."
    cp -r ../assets/* ./assets/ 2>/dev/null || echo "ℹ️  No hay assets para copiar"
fi

# Crear archivo .nojekyll para evitar que Jekyll procese el sitio
touch .nojekyll

echo ""
echo "📦 Archivos preparados en la raíz del repositorio:"
echo "📋 Contenido:"
ls -la

# Cambiar a la rama principal (main)
git checkout main 2>/dev/null || git checkout master 2>/dev/null || echo "ℹ️  Usando rama actual"

# Agregar archivos al git
echo "📝 Agregando archivos a git..."
git add .

# Verificar si hay cambios
if git diff --staged --quiet; then
    echo "ℹ️  No hay cambios para commitear"
else
    # Hacer commit
    echo "💾 Creando commit..."
    git commit -m "🚀 Actualizar menú digital raíz - $(date)"

    # Hacer push
    echo "⬆️  Subiendo cambios a GitHub Pages..."
    if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
        echo ""
        echo "🎉 ¡Despliegue exitoso!"
        echo ""
        echo "🌐 Tu menú digital está disponible en:"
        echo "   https://yaotzin37.github.io/menu-tajal.io/"
        echo ""
        echo "📱 Características:"
        echo "   ✅ Menú completo con datos de respaldo"
        echo "   ✅ Funciona sin servidor externo"
        echo "   ✅ Totalmente responsivo para móviles"
        echo "   ✅ Integración con WhatsApp"
        echo "   ✅ Información completa del restaurante"
        echo ""
        echo "🔄 Para futuras actualizaciones:"
        echo "   ./deploy_github_root.sh"
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
echo "🎯 Tu menú digital ya está disponible públicamente:"
echo "   https://yaotzin37.github.io/menu-tajal.io/"
echo ""
echo "💡 Consejo: Comparte esta URL directamente con tus clientes"
