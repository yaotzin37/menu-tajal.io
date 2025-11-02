---
# ============================================
# FRONT MATTER - METADATOS DE LA PÁGINA
# ============================================
# Buena práctica: Usar front matter YAML para configurar cada página
# Comparación: En el original, los metadatos están hardcodeados en HTML

layout: default
title: "Menú Tajal - Restaurante de Comida Tradicional"
description: "Descubre nuestro menú de comida tradicional con platillos auténticos y bebidas refrescantes"
keywords: "restaurante, menú digital, comida tradicional, Tajal"
permalink: /

# Open Graph para redes sociales (SEO)
og_title: "Menú Tajal - Comida Tradicional Auténtica"
og_description: "Explora nuestro menú digital interactivo"
og_image: "/assets/images/og-image.jpg"
---

<!-- 
  ============================================
  PÁGINA PRINCIPAL - INDEX.MD
  ============================================
  
  BUENAS PRÁCTICAS APLICADAS:
  
  1. CONTENIDO SEPARADO DE ESTRUCTURA
     - Original: Todo mezclado en HTML
     - Correcto: Markdown para contenido, layouts para estructura
  
  2. SEO OPTIMIZADO
     - Meta tags en front matter
     - Estructura semántica de encabezados
     - Alt text descriptivo en imágenes
  
  3. ACCESIBILIDAD
     - Encabezados jerárquicos (h1, h2, h3)
     - Enlaces descriptivos
     - Contraste adecuado (definido en CSS)
  
  4. MODULARIDAD
     - Reutilización de layouts
     - Includes para componentes repetidos
     - Variables de configuración centralizadas
-->

# Bienvenidos a Menú Tajal

## Restaurante de Comida Tradicional

<!-- Hero Section -->
<section class="hero" aria-label="Sección de bienvenida">
  <div class="hero-content">
    <p class="tagline">Sabores auténticos que cuentan historias</p>
    <a href="#menu" class="cta-button" aria-label="Ver nuestro menú completo">Ver Menú</a>
  </div>
</section>

<!-- Menú Section -->
<section id="menu" class="menu-section" aria-labelledby="menu-heading">
  <h2 id="menu-heading">Nuestro Menú</h2>
  
  <!-- 
    Buena práctica: En una implementación completa, aquí usaríamos:
    {% for categoria in site.categorias %}
      {% include menu-category.html categoria=categoria %}
    {% endfor %}
    
    Esto permite gestionar el menú desde archivos de datos (_data/menu.yml)
    en lugar de hardcodear en HTML como en el original.
  -->
  
  <div class="menu-categories">
    <!-- Las categorías se cargarán dinámicamente con Jekyll includes -->
    <!-- Ejemplo de estructura que será completada: -->
    
    <article class="category" aria-labelledby="cat-platillos">
      <h3 id="cat-platillos">Platillos Principales</h3>
      <!-- Items del menú aquí -->
    </article>
    
    <article class="category" aria-labelledby="cat-bebidas">
      <h3 id="cat-bebidas">Bebidas</h3>
      <!-- Items del menú aquí -->
    </article>
  </div>
</section>

<!-- Contacto Section -->
<section class="contact-section" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contáctanos</h2>
  <address>
    <p><strong>Teléfono:</strong> <a href="tel:{{ site.contact.phone }}">{{ site.contact.phone }}</a></p>
    <p><strong>Dirección:</strong> {{ site.contact.address }}</p>
    <p><strong>Horario:</strong> {{ site.contact.hours }}</p>
  </address>
</section>

<!-- 
  NOTA IMPORTANTE:
  
  Este es un ejemplo base. La implementación completa incluiría:
  
  - _data/menu.yml: Datos del menú en formato estructurado
  - _includes/menu-item.html: Componente reutilizable para items
  - _includes/category.html: Componente para categorías
  - assets/js/menu-filter.js: JavaScript modular para filtrado
  - _sass/components/_menu.scss: Estilos organizados en componentes
  
  Comparado con el original donde todo está en un solo archivo,
  esta estructura facilita el mantenimiento, pruebas y escalabilidad.
-->
