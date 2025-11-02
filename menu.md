---
layout: menu
title: "Nuestro Menú"
subtitle: "Sabores Auténticos de Oaxaca"
description: "Descubre los platillos tradicionales que hacen única nuestra cocina"
permalink: /menu.html
note: "Los precios pueden variar sin previo aviso. Pregunta por nuestras opciones vegetarianas."
---

<!--
  ============================================
  ARCHIVO: menu.md
  LAYOUT: menu
  ============================================
  
  Este archivo usa el layout especializado menu.html que incluye:
  - Hero section con título y descripción
  - Área de contenido para categorías
  - Notas adicionales
  
  Para agregar categorías, usa el include menu/menu-category.html:
  {% include menu/menu-category.html category="nombre-categoria" %}
  
  Los datos deben estar en _data/menu.yml
-->

## Entradas

{% include menu/menu-category.html category="entradas" %}

## Platos Fuertes

{% include menu/menu-category.html category="platos-fuertes" %}

## Postres

{% include menu/menu-category.html category="postres" %}

<!--
  NOTA PARA DESARROLLADORES:
  
  Para agregar más categorías:
  1. Agrégalas a _data/menu.yml siguiendo la estructura existente
  2. Añade una nueva sección aquí con el include correspondiente
  3. El include renderizará automáticamente todos los platillos de esa categoría
  
  Ejemplo de estructura en _data/menu.yml:
  
  entradas:
    title: "Entradas"
    description: "Para comenzar tu experiencia"
    items:
      - name: "Guacamole con Chapulines"
        description: "Aguacate fresco con chapulines tostados"
        price: "$120"
        vegetarian: false
        spicy: 1
-->
