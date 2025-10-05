#!/bin/bash
# Inicio simplificado del menú digital TAJAL

echo "🍕 Iniciando Menú Digital TAJAL"
echo "=" * 40

# Función para verificar si un proceso está corriendo
check_process() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📚 Instalando dependencias..."
pip install -r requirements.txt

echo ""
echo "🚀 Iniciando servidor..."
echo ""

# Iniciar servidor API
echo "🌐 Iniciando servidor API en puerto 8000..."
python3 src/api/pos_api.py &
API_PID=$!

# Esperar a que el servidor inicie
sleep 3

# Verificar si está corriendo
if check_process "pos_api.py"; then
    echo "✅ Servidor iniciado correctamente"
    echo ""
    echo "🎉 ¡Sistema listo!"
    echo ""
    echo "🌐 Servicios disponibles:"
    echo "   • Menú Digital: http://localhost:8000/src/web/menu_digital.html"
    echo "   • Panel Admin: http://localhost:8000/src/web/admin.html"
    echo "   • API: http://localhost:8000"
    echo "   • Documentación: http://localhost:8000/docs"
    echo ""
    echo "📝 Funcionalidades:"
    echo "   • Ver menú digital moderno y responsive"
    echo "   • Buscar y filtrar platillos"
    echo "   • Agregar platillos al carrito"
    echo "   • Gestionar menú desde el panel admin"
    echo "   • Sincronización automática con carta.txt"
    echo ""
    echo "⚠️  Presiona Ctrl+C para detener el servidor"
    echo ""

    # Mantener corriendo hasta Ctrl+C
    wait $API_PID
else
    echo "❌ Error: No se pudo iniciar el servidor"
    exit 1
fi
