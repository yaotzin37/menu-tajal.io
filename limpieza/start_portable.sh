#!/bin/bash
# 🌐 Menú Digital TAJAL - Modo Portátil (con ngrok)

echo "🚀 Iniciando Menú Digital TAJAL - Modo Portátil"
echo "=============================================="

# Función para verificar si un proceso está corriendo
check_process() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Función para detener todos los procesos
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."

    # Detener ngrok
    if pgrep -f "ngrok" > /dev/null; then
        echo "Deteniendo ngrok..."
        pkill -f "ngrok"
    fi

    # Detener servidor API
    if pgrep -f "src/api/pos_api.py" > /dev/null; then
        echo "Deteniendo servidor API..."
        pkill -f "src/api/pos_api.py"
    fi

    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias (incluyendo ngrok)
echo "📚 Instalando dependencias..."
pip install -r requirements.txt

echo ""
echo "🏪 Iniciando componentes del sistema..."
echo ""

# Iniciar servidor API en segundo plano
echo "🔌 Iniciando servidor API en puerto 8000..."
python3 src/api/pos_api.py &
API_PID=$!

# Esperar 3 segundos para que el servidor API inicie
sleep 3

# Verificar si el servidor API está corriendo
if ! check_process "src/api/pos_api.py"; then
    echo "❌ Error: No se pudo iniciar el servidor API"
    cleanup
fi

echo "✅ Servidor API iniciado (PID: $API_PID)"

# Iniciar ngrok para exponer el puerto 8000
echo ""
echo "🌐 Iniciando ngrok para acceso remoto..."
echo "   (Esto hará tu menú accesible desde cualquier móvil)"

# Intentar iniciar ngrok
if command -v ngrok &> /dev/null; then
    echo "📱 Usando ngrok instalado en el sistema..."
    ngrok http 8000 > /dev/null 2>&1 &
    NGROK_PID=$!
else
    echo "📦 Instalando y ejecutando ngrok..."
    python3 -c "
import subprocess
import time
import sys

# Instalar ngrok si no está disponible
try:
    import ngrok
    print('✅ ngrok Python instalado')
except ImportError:
    print('📥 Instalando ngrok Python...')
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'ngrok'], check=True)

# Iniciar ngrok
print('🚀 Iniciando ngrok...')
try:
    import ngrok
    listener = ngrok.forward(8000, authtoken_from_env=True)
    print(f'✅ ngrok activo: {listener.url()}')
    print(f'🔗 URL pública: {listener.url()}')
except Exception as e:
    print(f'❌ Error con ngrok: {e}')
    print('💡 Alternativa: Instala ngrok manualmente desde https://ngrok.com')
    print('   Luego ejecuta: ngrok http 8000')
" &
    NGROK_PID=$!
fi

# Esperar a que ngrok inicie
sleep 5

# Verificar si ngrok está corriendo
if check_process "ngrok"; then
    echo ""
    echo "🎉 ¡Sistema portátil activo!"
    echo ""
    echo "📱 Accede desde tu móvil:"
    echo "   🌐 Menú Digital: https://TU-NGROK-URL/src/web/menu_digital.html"
    echo "   ⚙️ Panel Admin: https://TU-NGROK-URL/src/web/admin.html"
    echo "   📚 Documentación: https://TU-NGROK-URL/docs"
    echo ""
    echo "🔍 Para encontrar tu URL ngrok:"
    echo "   1. Revisa la terminal arriba (busca 'https://')"
    echo "   2. O visita: http://localhost:4040 (inspector web de ngrok)"
    echo ""
    echo "💡 Consejos:"
    echo "   • Comparte la URL con tus clientes"
    echo "   • El menú funciona completamente offline en móviles"
    echo "   • Los cambios se sincronizan automáticamente"
    echo ""
    echo "⚠️  Presiona Ctrl+C para detener todos los servicios"
    echo ""

    # Mantener corriendo hasta Ctrl+C
    wait
else
    echo ""
    echo "⚠️  Ngrok no se pudo iniciar automáticamente"
    echo ""
    echo "🔧 Soluciones alternativas:"
    echo ""
    echo "Opción 1 - Instalar ngrok manualmente:"
    echo "   1. Ve a https://ngrok.com/download"
    echo "   2. Descarga e instala ngrok"
    echo "   3. Ejecuta: ngrok http 8000"
    echo ""
    echo "Opción 2 - Usar servicio de cloud:"
    echo "   • Desplegar en Heroku, DigitalOcean, etc."
    echo "   • Crear cuenta gratuita y subir el código"
    echo ""
    echo "🌐 Mientras tanto, el servidor local funciona en:"
    echo "   http://localhost:8000/src/web/menu_digital.html"
    echo ""
    echo "❌ Presiona Ctrl+C para salir"
    echo ""

    # Mantener corriendo hasta Ctrl+C
    wait $API_PID
fi
