# 🌐 Conectar Menú Digital con GitHub Pages

¡Perfecto! Ya tienes tu sitio web en **https://yaotzin37.github.io/menu-tajal.io/**. Ahora puedes conectar tu menú digital para que sea accesible públicamente.

## 🚀 **Opción 1: Despliegue Automático (Más Fácil)**

### Ejecutar despliegue automático:

```bash
# Desde tu proyecto TAJAL
./deploy_to_github.sh

# O usando make
make deploy-github
```

**¿Qué hace este script?**
- ✅ Copia el menú digital a tu repositorio de GitHub
- ✅ Crea la estructura correcta para GitHub Pages
- ✅ Hace commit y push automáticamente
- ✅ El menú queda disponible en: **https://yaotzin37.github.io/menu-tajal.io/menu-digital/**

## 🔧 **Opción 2: Despliegue Manual**

### 1. **Preparar archivos:**

```bash
# Crear directorio para el menú digital
mkdir -p deploy/menu-digital

# Copiar menú digital
cp src/web/menu_digital.html deploy/menu-digital/index.html

# Copiar assets si tienes
cp -r assets deploy/menu-digital/
```

### 2. **Configurar GitHub Pages:**

```bash
# Clonar tu repositorio (si no lo tienes)
git clone https://github.com/yaotzin37/menu-tajal.io.git

# Entrar al repositorio
cd menu-tajal.io

# Copiar archivos del menú
cp -r ../deploy/menu-digital/* .

# Crear archivo .nojekyll (importante para GitHub Pages)
touch .nojekyll

# Agregar y commitear
git add .
git commit -m "Agregar menú digital interactivo"
git push origin main
```

## 🌐 **URLs Resultantes:**

Después del despliegue, tendrás estas URLs públicas:

| URL | Descripción |
|-----|-------------|
| **🏠 Sitio Principal** | https://yaotzin37.github.io/menu-tajal.io/ |
| **🍽️ Menú Digital** | https://yaotzin37.github.io/menu-tajal.io/menu-digital/ |
| **📱 Móvil** | Funciona perfectamente en móviles |

## 🔗 **Conectar con tu Sitio Principal:**

### Opción A: Agregar botón en tu sitio existente

En tu archivo `index.html` existente, agrega este botón:

```html
<!-- En el header o navegación -->
<a href="menu-digital/" style="
    background: #d32f2f;
    color: white;
    padding: 15px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin: 10px;
    transition: all 0.3s ease;
">
    🍽️ Ver Menú Digital Completo
</a>
```

### Opción B: Página dedicada

Crear un enlace en tu menú de navegación:

```html
<nav>
    <a href="/">Inicio</a>
    <a href="menu-digital/">Menú Digital</a>
    <a href="#contacto">Contacto</a>
</nav>
```

## 📱 **Características del Menú Digital Público:**

### ✅ **Lo que funciona:**
- ✅ **Interfaz moderna** y responsiva
- ✅ **Búsqueda de platillos** en tiempo real
- ✅ **Filtros por categorías**
- ✅ **Carrito de compras** interactivo
- ✅ **Integración con WhatsApp** para pedidos
- ✅ **Diseño profesional** que combina con tu marca

### ✅ **Datos incluidos:**
- ✅ **306 platillos** desde tu `carta.txt`
- ✅ **Categorías organizadas** automáticamente
- ✅ **Información del restaurante** incluida
- ✅ **Enlaces a redes sociales**

## 🚨 **Solución de Problemas:**

### Si el menú no carga datos:
```bash
# Ejecutar servidor local
./start_menu.sh

# El menú digital público intentará conectarse primero al servidor local
# Si falla, mostrará datos de respaldo
```

### Para actualizar el menú:
```bash
# 1. Actualizar tu carta.txt
# 2. Sincronizar base de datos
# 3. Ejecutar despliegue
./deploy_to_github.sh
```

## 🎯 **Próximos Pasos:**

1. **Ahora**: `./deploy_to_github.sh` - Desplegar menú
2. **Luego**: Probar que funcione en móviles
3. **Agregar**: Enlace desde tu sitio principal
4. **Compartir**: La URL pública con clientes

## 💡 **Ventajas de esta solución:**

- ✅ **Gratis** - GitHub Pages es gratuito
- ✅ **Rápido** - Se carga instantáneamente
- ✅ **SEO friendly** - Indexable por Google
- ✅ **Responsive** - Perfecto para móviles
- ✅ **Profesional** - Se ve como una app real
- ✅ **Escalable** - Crece con tu restaurante

---

**¡Tu menú digital estará disponible públicamente en minutos! 🚀**

¿Quieres que ejecute el despliegue automático ahora mismo?
