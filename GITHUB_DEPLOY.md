# 🚀 Guía de Despliegue en GitHub Pages

Este archivo explica cómo configurar tu repositorio de GitHub para que el sitio se construya y despliegue automáticamente cada vez que hagas un cambio.

## 1. Preparación del Repositorio

Asegúrate de que tu repositorio en GitHub esté configurado correctamente:

1. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
2. En el menú lateral, haz clic en **Pages**.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.

## 2. Crear el Flujo de Trabajo (Workflow)

Debes crear un archivo en tu proyecto con la siguiente ruta y contenido. Esto le dirá a GitHub cómo instalar Python, generar los menús y publicar el sitio.

**Ruta del archivo:** `.github/workflows/deploy.yml`

**Contenido del archivo:**

```yaml
name: Deploy to GitHub Pages

on:
  # Ejecutar al hacer push a la rama main
  push:
    branches: ["main"]

  # Permite ejecutar manualmente desde la pestaña Actions
  workflow_dispatch:

# Permisos necesarios para desplegar en Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Una sola ejecución concurrente
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Trabajo de construcción
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pandas requests

      - name: Generate Menus
        run: |
          python scripts/generador_menu.py
          python scripts/generador_mixologia.py
          # Verificar que se crearon los archivos
          ls -l menu-platillos.html menu-mixologia.html

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Subir todo el directorio actual como sitio web
          path: '.'

  # Trabajo de despliegue
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 3. ¿Qué hace este archivo?

1. **Instala Python**: Prepara un entorno con Python 3.10.
2. **Instala Librerías**: Descarga `pandas` y `requests`, necesarios para tus scripts.
3. **Ejecuta los Generadores**: Corre `generador_menu.py` y `generador_mixologia.py` para crear los archivos HTML actualizados con los últimos datos de tus CSV.
4. **Publica**: Sube los archivos resultantes (HTML, CSS, imágenes) a GitHub Pages.

## 4. Verificar el Despliegue

Una vez que subas este archivo a GitHub:

1. Ve a la pestaña **Actions** en tu repositorio.
2. Verás un flujo de trabajo llamado "Deploy to GitHub Pages" ejecutándose.
3. Cuando termine (icono verde ✅), tu sitio estará actualizado en la URL de GitHub Pages.
