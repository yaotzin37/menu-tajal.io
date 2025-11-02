---
layout: mixologia
title: "Mixología de Autor"
subtitle: "Cócteles Artesanales con Mezcal y Tequila"
description: "Explora nuestra colección de cócteles únicos, creados por nuestros mixologos expertos"
permalink: /mixologia.html
note: "Todos nuestros cócteles son preparados al momento con ingredientes frescos y de la más alta calidad."
responsible_message: "Disfruta con moderación. Prohibida la venta de alcohol a menores de 18 años."
---

<!--
  ============================================
  ARCHIVO: mixologia.md
  LAYOUT: mixologia
  ============================================
  
  Este archivo usa el layout especializado mixologia.html que incluye:
  - Hero section con título y descripción
  - Área de contenido para cócteles
  - Mensaje de consumo responsable
  - Notas adicionales
  
  Para agregar cócteles, usa el include mixologia/drink-card.html:
  {% include mixologia/drink-card.html drink="nombre-coctel" %}
  
  Los datos deben estar en _data/mixologia.yml
-->

## Cócteles Clásicos

<div class="drinks-grid">
  {% for drink_id in site.data.mixologia.clasicos %}
    {% include mixologia/drink-card.html drink=drink_id %}
  {% endfor %}
</div>

## Cócteles de Autor

<div class="drinks-grid">
  {% for drink_id in site.data.mixologia.autor %}
    {% include mixologia/drink-card.html drink=drink_id %}
  {% endfor %}
</div>

## Bebidas Sin Alcohol

<div class="drinks-grid">
  {% for drink_id in site.data.mixologia.sin-alcohol %}
    {% include mixologia/drink-card.html drink=drink_id %}
  {% endfor %}
</div>

<!--
  NOTA PARA DESARROLLADORES:
  
  Para agregar más cócteles:
  1. Agrégalos a _data/mixologia.yml con sus detalles completos
  2. El include renderizará automáticamente cada cóctel con su información
  3. Puedes crear nuevas categorías agregando secciones similares
  
  Ejemplo de estructura en _data/mixologia.yml:
  
  clasicos:
    - margarita
    - paloma
  autor:
    - oaxaca-old-fashioned
  
  margarita:
    name: "Margarita Clásica"
    description: "Tequila blanco, triple sec y limón fresco"
    ingredients:
      - "50ml Tequila Blanco"
      - "25ml Triple Sec"
      - "25ml Jugo de limón"
    price: "$180"
    image: "/assets/images/margarita.jpg"
    alcohol_content: "15%"
    category: "Clásicos"
-->
