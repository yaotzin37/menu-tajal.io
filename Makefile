.PHONY: help install run run-api run-sync portable deploy deploy-github

# Variables
PYTHON := python3
PIP := $(PYTHON) -m pip
API_FILE := src/api/pos_api.py
SYNC_FILE := src/scripts/menu_sync.py
MENU_FILE := data/carta.txt

# Default target
help:
	@echo "🍕 Menú Digital TAJAL - Comandos Disponibles"
	@echo "==========================================="
	@echo ""
	@echo "🚀 Desarrollo:"
	@echo "  make install     - Instalar dependencias"
	@echo "  make run         - Iniciar servidor local"
	@echo "  make run-api     - Ejecutar solo la API"
	@echo "  make run-sync    - Ejecutar sincronizador"
	@echo ""
	@echo "📱 Portabilidad:"
	@echo "  make portable    - Iniciar modo portátil (ngrok)"
	@echo "  make deploy      - Información de despliegue"
	@echo "  make deploy-github - Desplegar en GitHub Pages"
	@echo ""
	@echo "🛠️  Mantenimiento:"
	@echo "  make sync        - Sincronizar menú"
	@echo "  make clean       - Limpiar archivos temporales"
	@echo "  make clean-all   - Limpiar todo"
	@echo ""
	@echo "📚 Documentación:"
	@echo "  make docs        - Construir documentación"
	@echo "  make status      - Ver estado del proyecto"

# Instalación
install:
	@echo "📦 Instalando dependencias..."
	$(PIP) install -r requirements.txt

# Ejecución
run: install
	@echo "🚀 Iniciando menú digital TAJAL..."
	$(PYTHON) $(API_FILE)

run-api: install
	@echo "🔌 Iniciando servidor API..."
	$(PYTHON) $(API_FILE)

run-sync: install
	@echo "🔄 Iniciando sincronizador de menú..."
	$(PYTHON) $(SYNC_FILE)

# Portabilidad
portable: install
	@echo "📱 Iniciando menú digital en modo portátil..."
	./start_portable.sh

deploy:
	@echo "🚢 Desplegando en producción..."
	@echo "💡 Opciones disponibles:"
	@echo "   1. GitHub Pages: ./deploy_to_github.sh"
	@echo "   2. Heroku: https://www.heroku.com"
	@echo "   3. DigitalOcean: https://www.digitalocean.com"
	@echo "   4. Railway: https://railway.app"
	@echo ""
	@echo "📋 Pasos generales:"
	@echo "   1. Crear cuenta en plataforma"
	@echo "   2. Conectar repositorio GitHub"
	@echo "   3. Desplegar automáticamente"
	@echo "   4. Configurar dominio personalizado"

deploy-github:
	@echo "🚀 Desplegando menú digital en GitHub Pages..."
	./deploy_to_github.sh

clean:
	@echo "🧹 Limpiando archivos temporales..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	@echo "✅ Archivos temporales eliminados"

clean-all: clean
	@echo "🗑️  Eliminando entorno virtual y datos temporales..."
	rm -rf venv/
	rm -rf *.egg-info/
	rm -f data/menu_pos.db
	@echo "✅ Entorno limpio"

# Testing
test:
	@echo "🧪 Ejecutando tests..."
	@echo "❌ No hay tests implementados aún"

# Documentación
docs:
	@echo "📚 Construyendo documentación..."
	@echo "❌ No hay sistema de documentación implementado aún"

serve-docs:
	@echo "🌐 Sirviendo documentación..."
	@echo "❌ No hay servidor de documentación implementado aún"

# Utilidades
format:
	@echo "🎨 Formateando código Python..."
	black src/ || echo "Black no está instalado. Instalar con: pip install black"

lint:
	@echo "🔍 Verificando calidad del código..."
	flake8 src/ || echo "Flake8 no está instalado. Instalar con: pip install flake8"

status:
	@echo "📊 Estado del proyecto TAJAL"
	@echo "============================"
	@echo ""
	@echo "📁 Archivos principales:"
	@find src/ -name "*.py" | wc -l | xargs echo "  - Scripts Python:" 
	@find src/web -name "*.html" | wc -l | xargs echo "  - Páginas web:"
	@find data/ -name "*.txt" | wc -l | xargs echo "  - Archivos de datos:"
	@echo ""
	@echo "🗂️  Tamaño del proyecto:"
	@du -sh . | cut -f1 | xargs echo "  - Tamaño total:"
	@echo ""
	@echo "🔗 Estado del servidor:"
	@curl -s http://localhost:8000 > /dev/null && echo "  - API: ✅ Corriendo" || echo "  - API: ❌ Detenido"
	@echo ""
	@echo "📋 Últimos cambios:"
	@git log --oneline -5 2>/dev/null || echo "  - Git: No inicializado"

# Setup inicial (para nuevos desarrolladores)
setup: install
	@echo "🎯 Configuración inicial completada"
	@echo ""
	@echo "✅ Para empezar:"
	@echo "   1. make run    - Iniciar el servidor"
	@echo "   2. Abrir http://localhost:8000/src/web/menu_digital.html"
	@echo "   3. Abrir http://localhost:8000/src/web/admin.html"
	@echo ""
	@echo "📖 Lee el README.md para más detalles"
