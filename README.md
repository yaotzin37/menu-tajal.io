# 🍕 Menú Digital TAJAL - Sistema Profesional

**¡Tu menú digital profesional listo para integrarse con cualquier POS!**

## 📋 Características Principales

- ✅ **Menú digital moderno** con interfaz responsiva
- ✅ **Panel de administración** completo para gestión del menú
- ✅ **API REST** preparada para integración con sistemas POS
- ✅ **Sincronización automática** desde archivo de texto
- ✅ **Base de datos** integrada para pedidos e inventario
- ✅ **Soporte multi-POS** (Square, Toast, Lightspeed, etc.)

## 🚀 Inicio Rápido

### 1. Instalar y Ejecutar

```bash
# Clonar o descargar el proyecto
cd /ruta/al/proyecto

# Ejecutar el menú digital (¡todo automático!)
./start_menu.sh
```

### 2. Acceder a los Servicios

Una vez iniciado el servidor:

- 🌐 **Menú Digital**: http://localhost:8000/src/web/menu_digital.html
- ⚙️ **Panel Admin**: http://localhost:8000/src/web/admin.html
- 🔌 **API REST**: http://localhost:8000
- 📚 **Documentación**: http://localhost:8000/docs

## 📁 Estructura del Proyecto

```
Tajalestiloqwen/
├── src/                          # Código fuente principal
│   ├── api/
│   │   └── pos_api.py           # Servidor API FastAPI
│   ├── web/
│   │   ├── menu_digital.html    # Menú digital moderno
│   │   ├── admin.html           # Panel de administración
│   │   ├── index.html           # Página principal existente
│   │   └── crm_menu.html        # Interfaz CRM básica
│   └── scripts/
│       ├── menu_sync.py         # Sincronizador automático
│       ├── pos_connector.py     # Ejemplos de integración POS
│       └── generar_menu_xml.py  # Generador XML existente
├── data/                         # Datos y archivos de configuración
│   ├── carta.txt                # Archivo fuente del menú
│   ├── menu_tajal.xml           # Menú en formato XML
│   └── menu_pos.db              # Base de datos SQLite
├── assets/                       # Recursos estáticos
│   └── imagenes/                # Imágenes del menú
├── docs/                         # Documentación
│   ├── estructura.md            # Especificación del proyecto
│   └── README_original.md       # README original
├── .gitignore                    # Archivos a ignorar en git
├── requirements.txt              # Dependencias Python
└── start_menu.sh                 # Script de inicio automático
```

## 🔧 Gestión del Menú

### Agregar Nuevos Platillos

1. **Desde el Panel Admin**: http://localhost:8000/src/web/admin.html
   - Interfaz gráfica intuitiva
   - Validación automática
   - Actualización en tiempo real

2. **Desde el Archivo**: Editar `data/carta.txt`
   ```text
   Nueva Categoría

   Nuevo Platillo
   Descripción del platillo

   $150.00
   ```

### Sincronización Automática

El sistema monitorea cambios en `data/carta.txt` y actualiza automáticamente:
- Base de datos interna
- Menú digital web
- APIs de integración

## 🔗 Integración con POS

### Cuando Tengas tu Sistema POS

1. **Configurar Webhooks** en tu POS apuntando a:
   ```
   POST http://localhost:8000/orders
   ```

2. **Obtener Menú Formateado**:
   ```bash
   # Para diferentes sistemas POS
   curl http://localhost:8000/pos-integration

   # Menú en formato JSON
   curl http://localhost:8000/menu

   # Menú por categoría
   curl http://localhost:8000/menu/Desayunos
   ```

3. **Ejemplos de Código**:
   ```python
   from src.scripts.pos_connector import POSConnector

   connector = POSConnector()
   menu_square = connector.get_menu_for_pos("square")
   ```

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Iniciar menú digital
./start_menu.sh

# Ejecutar solo la API
python3 src/api/pos_api.py

# Sincronizar menú manualmente
python3 src/scripts/menu_sync.py

# Generar XML (herramienta existente)
python3 src/scripts/generar_menu_xml.py
```

### Variables de Entorno

Crear archivo `.env` para configuración personalizada:

```bash
# Puerto del servidor
PORT=8000

# Archivo del menú
MENU_FILE=data/carta.txt

# Base de datos
DATABASE_URL=sqlite:///data/menu_pos.db
```

## 📞 Soporte y Ayuda

### Recursos Disponibles

- 📚 **Documentación API**: http://localhost:8000/docs
- 🔍 **Logs del servidor**: Se muestran en consola al ejecutar
- 📖 **Código fuente**: Disponible en `src/`

### Solución de Problemas

```bash
# Verificar que el servidor esté corriendo
ps aux | grep pos_api

# Ver logs en tiempo real
tail -f /dev/null  # Los logs aparecen en la consola del servidor

# Reiniciar servicios
./start_menu.sh
```

## 🎯 Próximos Pasos

- [ ] **Aplicación móvil** para meseros
- [ ] **Sistema de inventario** integrado
- [ ] **Reportes de ventas** y analytics
- [ ] **Integración con delivery** (Uber Eats, Rappi)
- [ ] **Sistema de reservas** en línea

## 📜 Licencia

Este proyecto está desarrollado para **TAJAL Restaurante & Mixología**.

---

**¡Tu menú digital profesional está listo para conquistar clientes y facilitar operaciones! 🚀**

*Última actualización: Octubre 2024*
