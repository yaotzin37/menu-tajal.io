---
layout: default
title: Mixología
permalink: /mixologia.html
---

# Mixología de Autor

<div class="mixologia-intro">
  <p>Descubre nuestra selección de cócteles artesanales, preparados con ingredientes premium y técnicas de mixología de autor.</p>
</div>

<div class="cocteles-container">
  {% for coctel in site.data.mixologia.cocteles %}
  <article class="coctel-card" data-tipo="{{ coctel.tipo }}">
    <div class="coctel-header">
      <h2 class="coctel-nombre">{{ coctel.nombre }}</h2>
      <span class="coctel-tipo">{{ coctel.tipo }}</span>
    </div>
    <p class="coctel-descripcion">{{ coctel.descripcion }}</p>
    <div class="coctel-ingredientes">
      <h4>Ingredientes:</h4>
      <ul>
        {% for ingrediente in coctel.ingredientes %}
        <li>{{ ingrediente }}</li>
        {% endfor %}
      </ul>
    </div>
    <p class="coctel-precio">${{ coctel.precio }}</p>
  </article>
  {% endfor %}
</div>

<style>
  .mixologia-intro {
    max-width: 800px;
    margin: 0 auto 3rem;
    text-align: center;
    font-size: 1.2rem;
    color: #555;
  }

  .cocteles-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .coctel-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .coctel-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
  }

  .coctel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 2px solid rgba(255,255,255,0.3);
    padding-bottom: 0.5rem;
  }

  .coctel-nombre {
    font-size: 1.5rem;
    margin: 0;
  }

  .coctel-tipo {
    background: rgba(255,255,255,0.2);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    text-transform: uppercase;
  }

  .coctel-descripcion {
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }

  .coctel-ingredientes h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    opacity: 0.9;
  }

  .coctel-ingredientes ul {
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }

  .coctel-ingredientes li {
    padding: 0.3rem 0;
    padding-left: 1.2rem;
    position: relative;
  }

  .coctel-ingredientes li:before {
    content: '•';
    position: absolute;
    left: 0;
    color: rgba(255,255,255,0.7);
  }

  .coctel-precio {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: right;
    margin: 0;
  }

  .coctel-card[data-tipo="clásico"] {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .coctel-card[data-tipo="refrescante"] {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  .coctel-card[data-tipo="sofisticado"] {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }

  .coctel-card[data-tipo="frutal"] {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }
</style>
