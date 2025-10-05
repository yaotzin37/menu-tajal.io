# 📱 Menú Digital TAJAL - Guía de Portabilidad

¡Sí puedes gestionar tu menú desde el móvil! Aquí tienes todas las opciones disponibles:

## 🚀 **Inicio Rápido - Modo Portátil**

### Método 1: Usando ngrok (Más Fácil)

```bash
# Ejecutar el modo portátil automático
./start_portable.sh

# O usando make
make portable
```

Esto iniciará:
- ✅ Servidor API local
- ✅ ngrok para acceso remoto
- ✅ URLs públicas para compartir

**Resultado:**
```
🌐 Servicios disponibles:
   • Menú Digital: https://TU-URL.ngrok.io/src/web/menu_digital.html
   • Panel Admin: https://TU-URL.ngrok.io/src/web/admin.html
```

### Método 2: Instalación Manual de ngrok

1. **Instalar ngrok:**
   ```bash
   # Opción A: Usando npm (si tienes Node.js)
   npm install -g ngrok

   # Opción B: Descargar desde https://ngrok.com
   # Extraer y colocar en /usr/local/bin/ngrok
   ```

2. **Ejecutar ngrok:**
   ```bash
   # En una terminal
   ngrok http 8000

   # En otra terminal
   ./start_menu.sh
   ```

## 📱 **Acceso desde Móvil**

### 1. Compartir URL
- Envía la URL de ngrok a tu móvil por WhatsApp, email, etc.
- El menú funciona completamente en móviles modernos

### 2. Instalar como App (PWA)
- En Chrome/Safari móvil: "Agregar a pantalla de inicio"
- Se instala como una app nativa
- Funciona sin conexión (parcialmente)

## 🌐 **Opciones de Despliegue Permanente**

### Plataformas Gratuitas:

#### 1. **Railway** (Más Fácil)
- ✅ **Gratis** para proyectos pequeños
- ✅ Despliegue automático desde GitHub
- ✅ Base de datos incluida

**Pasos:**
```bash
# Crear cuenta en railway.app
# Conectar repositorio GitHub
# Desplegar automáticamente
```

#### 2. **Render**
- ✅ **Gratis** con límites generosos
- ✅ Despliegue automático
- ✅ Base de datos PostgreSQL gratis

#### 3. **Fly.io**
- ✅ **Gratis** hasta ciertos límites
- ✅ Muy rápido y moderno
- ✅ CLI fácil de usar

### Plataformas con Más Recursos:

#### 4. **Heroku** (Tradicional)
```bash
# Crear archivo Procfile
echo "web: python src/api/pos_api.py" > Procfile

# Desplegar
heroku create mi-menu-tajal
git push heroku main
```

#### 5. **DigitalOcean App Platform**
- ✅ **Gratis** por 3 meses
- ✅ Muy fácil de usar
- ✅ Escalable automáticamente

## 📋 **Comparación de Opciones**

| Método | Dificultad | Costo | Permanencia | Características |
|--------|------------|-------|-------------|-----------------|
| **ngrok** | ⭐ | $0 | Temporal | ✅ Más fácil<br>⚠️ URL cambia |
| **Railway** | ⭐⭐ | $0-5/mes | Permanente | ✅ Muy fácil<br>✅ Base de datos |
| **Heroku** | ⭐⭐⭐ | $0-7/mes | Permanente | ✅ Tradicional<br>✅ Comunidad grande |
| **DigitalOcean** | ⭐⭐⭐ | $0-12/mes | Permanente | ✅ Potente<br>✅ Escalable |

## 💡 **Recomendaciones**

### Para Empezar (Ahora):
```bash
# Método más fácil
./start_portable.sh
```
- ✅ Funciona inmediatamente
- ✅ Perfecto para pruebas
- ✅ Comparte con clientes

### Para Producción (Más Adelante):
```bash
# Opción gratuita más fácil
# Crear cuenta en railway.app
# Desplegar desde GitHub
```

## 🔧 **Configuración Avanzada**

### Variables de Entorno para Producción

Crear archivo `.env`:
```bash
# Puerto (generalmente automático en plataformas cloud)
PORT=8000

# Base de datos (se configura automáticamente)
DATABASE_URL=postgresql://...

# Seguridad (agregar en producción)
SECRET_KEY=tu-clave-secreta-aqui
```

### Dominio Personalizado

1. **Comprar dominio** en Namecheap, GoDaddy, etc.
2. **Configurar DNS** apuntando a la plataforma
3. **SSL automático** (HTTPS gratis)

Ejemplo:
```
menudigital.tajal.com → Railway/Heroku
```

## 📱 **Características Móviles**

### ✅ Lo que funciona perfectamente:
- Ver menú completo
- Buscar platillos
- Filtrar por categorías
- Agregar al carrito
- Gestión del menú (admin)

### ⚠️ Limitaciones actuales:
- Cámara (no implementada)
- GPS (no necesario para menú)
- Notificaciones push (requiere configuración adicional)

## 🚨 **Solución de Problemas**

### ngrok no funciona:
```bash
# Instalar manualmente
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok

# Ejecutar
ngrok http 8000
```

### Problemas de conexión móvil:
- ✅ Verificar que el servidor esté corriendo
- ✅ Comprobar que ngrok esté activo
- ✅ Usar datos móviles (no WiFi público)

## 🎯 **Próximos Pasos**

1. **Ahora**: `./start_portable.sh` - Prueba inmediata
2. **Esta semana**: Crear cuenta gratuita en Railway
3. **Próximo mes**: Configurar dominio personalizado
4. **Futuro**: App móvil nativa para meseros

---

**¡Tu menú digital ya es portátil y accesible desde cualquier móvil! 📱✨**
