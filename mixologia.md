---
layout: default
title: Mixología
permalink: /mixologia.html
---

# Mixología de Autor

<!-- 
  Ejemplo de uso del include drink-card.html
  Este archivo demuestra cómo iterar sobre cocteles y bebidas
  utilizando el include reutilizable.
  
  Para ampliar la personalización:
  - Crea un archivo _data/mixologia.yml con tus cocteles
  - Añade imágenes de cada coctel
  - Incluye información de contenido alcohólico
  - Agrega filtros para ordenar por tipo (clásico, signature, frozen, etc.)
-->

<div class="mixologia-intro">
  <p>Descubre nuestra selección de cócteles artesanales, preparados con ingredientes premium y técnicas de mixología de autor.</p>
</div>

<div class="drinks-container">
  
  {% comment %}
    Itera sobre cada coctel definido en _data/mixologia.yml
    Cada coctel debe tener: nombre, precio, ingredientes (array), imagen (opcional)
  {% endcomment %}
  
  {% for coctel in site.data.mixologia.cocteles %}
    
    {% comment %}
      Usa el include drink-card.html para mostrar cada coctel
      Pasa todos los parámetros necesarios
    {% endcomment %}
    
    {% include drink-card.html 
       name=coctel.nombre 
       price=coctel.precio
       ingredients=coctel.ingredientes
       image=coctel.imagen
       description=coctel.descripcion
       alcohol_content=coctel.contenido_alcoholico
    %}
    
  {% endfor %}
  
</div>

<!-- Ejemplos estáticos para demostrar el uso sin datos -->
<div class="drinks-examples">
  
  <h2>Ejemplos de Cocteles</h2>
  
  {% comment %}
    Puedes usar el include directamente con valores literales
    para crear ejemplos o cocteles especiales
  {% endcomment %}
  
  <!-- Ejemplo 1: Margarita Tradicional -->
  {% assign margarita_ingredientes = "Tequila Blanco|Triple Sec|Jugo de Limón Fresco|Jarabe Simple|Sal de Mar" | split: "|" %}
  
  {% include drink-card.html 
     name="Margarita Tradicional" 
     price="$180"
     ingredients=margarita_ingredientes
     description="Un clásico atemporal con el balance perfecto entre dulce y ácido"
     alcohol_content="15% Vol."
  %}
  
  <!-- Ejemplo 2: Mezcal con Chapulines -->
  {% assign mezcal_ingredientes = "Mezcal Espadin|Limón|Sal de Gusano|Chapulines Tostados|Naranja" | split: "|" %}
  
  {% include drink-card.html 
     name="Mezcal con Chapulines" 
     price="$220"
     ingredients=mezcal_ingredientes
     description="Experiencia oaxaqueña auténtica con mezcal artesanal y chapulines"
     alcohol_content="40% Vol."
  %}
  
  <!-- Ejemplo 3: Mojito de Jamaica -->
  {% assign mojito_ingredientes = "Ron Blanco|Agua de Jamaica|Hierbabuena Fresca|Limón|Azucar Morena|Agua Mineral" | split: "|" %}
  
  {% include drink-card.html 
     name="Mojito de Jamaica" 
     price="$160"
     ingredients=mojito_ingredientes
     description="Refrescante fusión de mojito cubano con agua de jamaica mexicana"
     alcohol_content="12% Vol."
  %}
  
</div>

<!-- CSS Inline para mixología (mejor moverlo a un archivo CSS separado) -->
<style>
  .mixologia-intro {
    max-width: 800px;
    margin: 0 auto 3rem;
    text-align: center;
    font-size: 1.2rem;
    color: #555;
    padding: 2rem;
  }
  
  .drinks-container,
  .drinks-examples {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  .drinks-examples {
    margin-top: 4rem;
    padding-top: 4rem;
    border-top: 2px solid #e0e0e0;
  }
  
  .drinks-examples h2 {
    grid-column: 1 / -1;
    font-size: 2rem;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  /* Estilos para el include drink-card.html */
  .drink-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 2rem;
    color: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .drink-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }
  
  .drink-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  
  .drink-name {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    font-weight: bold;
  }
  
  .drink-description {
    font-size: 0.95rem;
    opacity: 0.95;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }
  
  .drink-ingredients {
    background: rgba(255,255,255,0.15);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .ingredients-label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .ingredients-list {
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .drink-alcohol {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .alcohol-icon {
    font-size: 1.2rem;
  }
  
  .drink-price {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: right;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.3);
  }
  
  .price-amount {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
</style>
