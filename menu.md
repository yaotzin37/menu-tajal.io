---
layout: default
title: Nuestro Menú
permalink: /menu.html
---

# Nuestro Menú

<!-- 
  Ejemplo de uso del include menu-category.html
  Este archivo demuestra cómo iterar sobre categorías y platillos
  utilizando el include reutilizable.
  
  Para ampliar la personalización:
  - Crea un archivo _data/menu.yml con tus categorías y platillos
  - Modifica las clases CSS en tu archivo de estilos
  - Añade más parámetros como imágenes o alérgenos
  - Cambia el diseño usando CSS Grid o Flexbox
-->

<div class="menu-container">
  
  {% comment %}
    Itera sobre cada categoría del menú definida en _data/menu.yml
    Cada categoría debe tener: nombre, platillos (array)
  {% endcomment %}
  
  {% for categoria in site.data.menu.categorias %}
    
    {% comment %}
      Usa el include menu-category.html para mostrar cada categoría
      Pasa el nombre de la categoría y su lista de platillos
    {% endcomment %}
    
    {% include menu-category.html 
       category_name=categoria.nombre 
       dishes=categoria.platillos 
    %}
    
  {% endfor %}
  
</div>

<!-- Ejemplo estático para demostrar la estructura sin datos -->
<div class="menu-example">
  
  <h2>Ejemplo: Categoría de Entradas</h2>
  
  {% comment %}
    También puedes usar el include con datos directos (sin _data)
    Define un array de platillos con assign
  {% endcomment %}
  
  {% assign entradas_ejemplo = "nombre:Guacamole con Chapulines,description:Aguacate fresco con chapulines tostados y totopos artesanales,price:$120|nombre:Ceviche de Pescado,description:Pescado fresco marinado en limón con chile serrano y cilantro,price:$160|nombre:Tacos de Chapulín,description:Tres tacos de maíz con chapulines al mojo de ajo,price:$95" | split: "|" %}
  
  {% comment %}
    Para usar datos estáticos o de ejemplo, necesitas crear un array de objetos.
    En este caso, es mejor definir los datos en _data/menu.yml
    El siguiente ejemplo muestra cómo se vería la estructura:
  {% endcomment %}
  
</div>

<!-- CSS Inline para el menú (mejor moverlo a un archivo CSS separado) -->
<style>
  .menu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* Estilos para el include menu-category.html */
  .menu-category {
    margin-bottom: 3rem;
  }
  
  .category-title {
    font-size: 2rem;
    color: #2c3e50;
    border-bottom: 3px solid #e74c3c;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .dishes-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .dish-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .dish-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .dish-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .dish-name {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .dish-description {
    color: #7f8c8d;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .dish-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #e74c3c;
  }
  
  .menu-example {
    margin-top: 4rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
</style>
