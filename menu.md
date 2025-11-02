---
layout: default
title: Nuestro Menú
permalink: /menu.html
---

# Nuestro Menú

<div class="menu-container">
  {% for categoria in site.data.menu.categorias %}
  <section class="menu-section">
    <h2 class="categoria-titulo">{{ categoria.nombre }}</h2>
    <div class="platillos-grid">
      {% for platillo in categoria.platillos %}
      <article class="platillo-card">
        <h3 class="platillo-nombre">{{ platillo.nombre }}</h3>
        <p class="platillo-descripcion">{{ platillo.descripcion }}</p>
        <p class="platillo-precio">${{ platillo.precio }}</p>
      </article>
      {% endfor %}
    </div>
  </section>
  {% endfor %}
</div>

<style>
  .menu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .menu-section {
    margin-bottom: 3rem;
  }

  .categoria-titulo {
    font-size: 2rem;
    color: #2c3e50;
    border-bottom: 3px solid #e74c3c;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .platillos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .platillo-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .platillo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .platillo-nombre {
    font-size: 1.3rem;
    color: #34495e;
    margin-bottom: 0.5rem;
  }

  .platillo-descripcion {
    color: #7f8c8d;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .platillo-precio {
    font-size: 1.2rem;
    font-weight: bold;
    color: #e74c3c;
  }
</style>
