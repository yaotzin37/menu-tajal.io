# Menu Tajal - Proyecto Jekyll

## Descripción
Sitio web del menú de Tajal, desarrollado con Jekyll para facilitar el mantenimiento y seguir buenas prácticas de desarrollo.

## Estructura Recomendada del Proyecto

```
menu-tajal.io/
├── _data/
│   ├── menu.yml          # Datos del menú de comida
│   └── mixologia.yml     # Datos de bebidas y cócteles
├── _includes/
│   └── [componentes reutilizables]
├── _layouts/
│   └── default.html
├── _sass/
│   └── [estilos SCSS]
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
├── _config.yml           # Configuración de Jekyll
├── index.html            # Página principal
└── README.md
```

## Requisitos Previos

- Ruby (versión 2.7 o superior)
- RubyGems
- GCC y Make

## Instalación

### 1. Instalar Jekyll y Bundler

```bash
gem install jekyll bundler
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/yaotzin37/menu-tajal.io.git
cd menu-tajal.io
```

### 3. Cambiar a la rama de desarrollo

```bash
git checkout refactor-jekyll-buenas-practicas
```

### 4. Instalar dependencias

```bash
bundle install
```

## Compilación y Desarrollo Local

### Servidor de desarrollo

Para iniciar el servidor local con recarga automática:

```bash
bundle exec jekyll serve
```

O con livereload:

```bash
bundle exec jekyll serve --livereload
```

El sitio estará disponible en: `http://localhost:4000`

### Compilar el sitio

Para generar los archivos estáticos en la carpeta `_site/`:

```bash
bundle exec jekyll build
```

### Compilación para producción

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Buenas Prácticas - Migración a Data Files

### ⚠️ Importante: Uso de Data Files para Menú y Mixología

Para mantener el código limpio y seguir las mejores prácticas de Jekyll, se recomienda **migrar el contenido del menú y la mixología a archivos de datos** (data files).

#### Ventajas de usar Data Files:

1. **Separación de contenido y presentación**: Los datos están separados del HTML/templates
2. **Facilidad de actualización**: Actualizar precios, platillos o bebidas sin tocar código
3. **Reutilización**: Los mismos datos pueden usarse en múltiples páginas
4. **Mantenibilidad**: Estructura clara y organizada en archivos YAML o JSON
5. **Escalabilidad**: Fácil agregar nuevas categorías o items

#### Ejemplo de estructura en `_data/menu.yml`:

```yaml
entradas:
  - nombre: "Guacamole Tradicional"
    descripcion: "Aguacate fresco, cilantro, cebolla, chile serrano"
    precio: "$120"
    imagen: "guacamole.jpg"
  
  - nombre: "Quesadillas"
    descripcion: "Tortilla hecha a mano con queso Oaxaca"
    precio: "$95"
    opciones:
      - "Flor de calabaza"
      - "Huitlacoche"
      - "Champiñones"

platos_fuertes:
  - nombre: "Mole Negro Oaxaqueño"
    descripcion: "Pollo en mole negro con arroz y tortillas"
    precio: "$185"
    imagen: "mole.jpg"
```

#### Ejemplo de estructura en `_data/mixologia.yml`:

```yaml
cocteleria_clasica:
  - nombre: "Margarita Clásica"
    ingredientes:
      - "Tequila blanco"
      - "Cointreau"
      - "Jugo de limón fresco"
      - "Jarabe natural"
    precio: "$145"
    
creaciones_tajal:
  - nombre: "Mezcal Passion"
    ingredientes:
      - "Mezcal artesanal"
      - "Maracuyá"
      - "Chile piquín"
      - "Jarabe de agave"
    precio: "$165"
    especial: true
```

#### Uso en templates:

```liquid
{% for entrada in site.data.menu.entradas %}
  <div class="menu-item">
    <h3>{{ entrada.nombre }}</h3>
    <p>{{ entrada.descripcion }}</p>
    <span class="precio">{{ entrada.precio }}</span>
  </div>
{% endfor %}
```

## Recursos Adicionales

- [Documentación oficial de Jekyll](https://jekyllrb.com/docs/)
- [Jekyll Data Files](https://jekyllrb.com/docs/datafiles/)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Contribuir

1. Crear una rama desde `refactor-jekyll-buenas-practicas`
2. Realizar los cambios
3. Hacer commit con mensajes descriptivos
4. Crear Pull Request

## Licencia

[Especificar licencia del proyecto]
