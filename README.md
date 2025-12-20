# 🍽️ Tajal - Restaurante & Mixología

Sitio web oficial del restaurante Tajal con sistema automatizado de gestión de menús, búsqueda en tiempo real y arquitectura modular.

## 📋 Descripción

Este proyecto contiene el sitio web de Tajal, destacando por su sistema automatizado para generar menús HTML (Platillos y Mixología) a partir de un único archivo CSV. Incluye una landing page moderna, búsqueda instantánea, modo oscuro/claro y optimización para móviles.

## 🚀 Características Principales

- **Landing Page Moderna**: Video hero responsivo, navegación transparente y galería interactiva.
- **Menús Automatizados**: Generados por scripts de Python desde un CSV único.
- **Búsqueda en Tiempo Real**: Filtrado instantáneo de platillos y bebidas.
- **Modo Oscuro/Claro**: Preferencia de tema persistente con estilos Glassmorphism.
- **Optimización Móvil**: Videos verticales específicos para celulares y diseño 100% responsivo.
- **Arquitectura Modular**: CSS y JavaScript externos para mejor mantenimiento.

## 📁 Estructura del Proyecto

```bash
pagina-tajal.io/
├── assets/                          # Recursos del sitio
│   ├── css/
│   │   └── main.css                 # Estilos globales
│   ├── js/
│   │   └── main.js                  # JavaScript global
│   ├── images/
│   │   ├── logos/                   # Logos (logo.webp)
│   │   └── menu/                    # Imágenes de platillos y bebidas
│   │       ├── mixologia/           # Imágenes de coctelería
│   │       └── ... (otras categorías)
│   └── video/                       # Videos optimizados (Desktop/Mobile)
├── data/                            # Datos maestros
│   └── menu-completo.csv            # CSV único con todos los items
├── scripts/                         # Scripts de automatización
│   ├── generador_menu.py            # Genera menu-platillos.html
│   ├── generador_mixologia.py       # Genera menu-mixologia.html
│   └── check_image_connections.py   # Validador de imágenes
├── index.html                       # Landing Page Principal
├── menu-platillos.html              # Menú de platillos (generado)
├── menu-mixologia.html              # Menú de bebidas (generado)
└── README.md                        # Documentación
```

## 📊 Estructura del CSV

El archivo `data/menu-completo.csv` contiene todos los items del menú con la siguiente estructura:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| ID | Identificador único | 1 |
| Categoría | Categoría del item | Desayunos, Coctelería, Licores |
| Nombre | Nombre del platillo/bebida | Chilaquiles, Margarita |
| Descripcion | Descripción detallada | Totopos crujientes... |
| Precio | Precio del item | $130.00 |
| Nota | **Tipo de menú** | `menu-platillos` o `menu-mixologia` |

> [!IMPORTANT]
> La columna **Nota** es crucial: determina si el item aparece en el menú de platillos o mixología.

## 🔄 Flujos de Trabajo

### 1. Actualizar Menús (Precios/Platillos)

1. Edita `data/menu-completo.csv` (asegúrate de que la columna **Nota** tenga el valor correcto).
2. Ejecuta el generador correspondiente:

    ```bash
    python3 scripts/generador_menu.py       # Para Platillos
    python3 scripts/generador_mixologia.py  # Para Mixología
    ```

3. Abre el archivo HTML generado para verificar.

### 2. Agregar Nuevos Items

1. Agrega una nueva fila en `data/menu-completo.csv`.
2. Completa todas las columnas, especialmente **Nota** (`menu-platillos` o `menu-mixologia`).
3. Si tienes imagen, guárdala en `assets/images/menu/[categoría]/`.
4. Regenera el menú correspondiente.

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3 (Variables, Glassmorphism), JavaScript (Vanilla).
- **Backend (Generación)**: Python 3, Pandas.
- **Assets**: FontAwesome (Iconos), Google Fonts (Lato, Dancing Script).

## 📝 Notas Técnicas

- **CSS/JS Externos**: Los menús usan `assets/css/main.css` y `assets/js/main.js` para mejor mantenimiento.
- **Videos Hero**: Carga condicional para servir videos diferentes en móvil y escritorio.
- **Filtrado Automático**: Los scripts filtran automáticamente por la columna "Nota" del CSV.

## 📞 Contacto

Para soporte técnico o actualizaciones del sistema.

---
© 2024 Tajal - Restaurante & Mixología.
