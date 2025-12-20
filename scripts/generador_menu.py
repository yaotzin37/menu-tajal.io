import pandas as pd
import os

def generar_menu_platillos():
    """
    Genera el archivo HTML para el menú de platillos a partir de un archivo CSV.
    """
    # Obtener la ruta base del proyecto (un nivel arriba de scripts/)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, 'data', 'menu-completo.csv')
    
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo '{csv_path}'")
        return
    
    # Filtrar solo platillos (excluir mixología)
    if 'Nota' in df.columns:
        df = df[df['Nota'] == 'menú-platillos']
    
    # Renombrar columnas para compatibilidad
    df.rename(columns={
        'Categoría': 'CATEGORIAS',
        'Nombre': 'NOMBRE',
        'Descripción': 'DESCRIPCION',
        'Precio': 'PRECIO'
    }, inplace=True)

    # Iniciar la estructura del HTML
    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Carta de platillos de Tajal: cortes a la parrilla, mariscos, ensaladas, pastas, hamburguesas y postres. Cocina que fusiona tradición y vanguardia.">
    <meta property="og:title" content="Carta de Platillos | Tajal - Restaurante & Mixología">
    <meta property="og:description" content="Descubre nuestra selección de platillos: cortes, mariscos, ensaladas, pastas y más.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tajalrestaurante.com/menu-platillos.html">
    <meta property="og:image" content="assets/images/logos/logo.webp">
    <link rel="icon" href="assets/images/logos/logo.webp">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">    
    <title>Carta de Tajal - Restaurante & Mixología</title>
    <link rel="stylesheet" href="assets/css/main.css">

</head>
<body class="menu-page menu-platillos">
    <div class="menu-hero">
        <video class="hero-video" autoplay loop muted playsinline preload="metadata" poster="assets/images/menu/ambiente/ambiente-1.webp">
            <!-- El video correcto se carga via JavaScript según el tamaño de pantalla -->
        </video>
        <div class="menu-hero-overlay"></div>
        <div class="menu-hero-content">
            <img src="assets/images/logos/logo.webp" alt="Tajal Logo" class="menu-hero-logo">
            <h1>Nuestra Carta</h1>
            <p>Descubre nuestra selección de platillos que fusionan tradición y vanguardia</p>
        </div>
    </div>
    <div class="container">
        <h1>Nuestro Menú</h1>
        <p class="distinctive">Disfruta de nuestra selección de platillos preparados con los mejores ingredientes y técnicas culinarias, fusionando sabores tradicionales con toques contemporáneos.</p>
"""
    def slugify(s: str) -> str:
        repl = (
            ("ñ", "n"), ("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"),
            ("Á", "a"), ("É", "e"), ("Í", "i"), ("Ó", "o"), ("Ú", "u"),
        )
        s = str(s).strip().lower().replace(" ", "-")
        for a, b in repl:
            s = s.replace(a, b)
        return ''.join(ch for ch in s if ch.isalnum() or ch in ['-','_'])

    categorias_unicas = [c for c in df['CATEGORIAS'].dropna().unique()]
    if categorias_unicas:
        html_content += """
        <div class="search-container">
            <input type="text" id="search-input" class="search-input" placeholder="Buscar platillo...">
        </div>
        """
        html_content += '<div class="category-select-wrap"><select id="category-select" class="category-select" aria-label="Seleccionar categoría">'
        html_content += '<option value="">Ver todas</option>'
        for c in categorias_unicas:
            html_content += f'<option value="{slugify(c)}">{c}</option>'
        html_content += '</select></div>'

    for categoria, grupo in df.groupby('CATEGORIAS'):
        html_content += f'<div class="category" id="{slugify(categoria)}">\n<h2>{categoria}</h2>\n<div class="menu-grid">\n'
        for _, row in grupo.iterrows():
            platillo = row['NOMBRE']
            descripcion = row['DESCRIPCION'] if pd.notna(row['DESCRIPCION']) else ''
            precio = row['PRECIO']
            # Lógica de búsqueda de imágenes
            img_filename = None
            
            # 1. Si hay columna IMAGEN/IMAGES y tiene valor
            possible_img_cols = ['IMAGEN', 'IMAGES', 'IMAGENES']
            img_col = next((c for c in possible_img_cols if c in df.columns), None)
            if img_col and pd.notna(row.get(img_col, '')) and str(row.get(img_col, '')).strip() != '':
                img_filename = str(row.get(img_col)).strip()
            
            # 2. Si no, intentar buscar por nombre del platillo
            if not img_filename:
                # Normalizar nombre: "Pulpo Estilo Tajal" -> "pulpo_estilo_tajal"
                normalized_name = str(platillo).lower().replace(' ', '_').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
                # Buscar archivos que empiecen con este nombre
                img_filename = normalized_name

            src = ''
            if img_filename:
                # Si es URL externa
                if img_filename.startswith('http'):
                     src = img_filename
                else:
                    # Buscar el archivo en assets/images/menu/ de forma recursiva
                    assets_dir = os.path.join(base_dir, 'assets', 'images', 'menu')
                    found_path = None
                    
                    # Normalizar el nombre para búsqueda flexible
                    # Eliminar espacios extras, guiones bajos al final, normalizar
                    name_clean = img_filename.split('.')[0]
                    name_clean = name_clean.strip().rstrip('_').replace(' _', '_').replace('_ ', '_')
                    name_normalized = name_clean.lower().replace(' ', '_')
                    
                    # Prioridad de extensiones
                    extensions_priority = ['.webp', '.jpg', '.jpeg', '.png']
                    
                    # Lista para almacenar posibles coincidencias
                    possible_matches = []
                    
                    # Debug: mostrar qué se está buscando
                    print(f"Buscando: {name_normalized}")
                    
                    for root, dirs, files in os.walk(assets_dir):
                        for file in files:
                            file_base = file.rsplit('.', 1)[0].lower()
                            file_ext = '.' + file.rsplit('.', 1)[1] if '.' in file else ''
                            
                            # Coincidencia exacta (prioridad 1)
                            if file_base == name_normalized:
                                possible_matches.append((1, os.path.join(root, file), file_ext))
                            # Coincidencia sin guion bajo final (prioridad 2)
                            elif file_base == name_normalized.rstrip('_'):
                                possible_matches.append((2, os.path.join(root, file), file_ext))
                            # Coincidencia parcial: el archivo contiene el nombre buscado (prioridad 3)
                            elif name_normalized in file_base:
                                possible_matches.append((3, os.path.join(root, file), file_ext))
                            # Coincidencia parcial inversa: el nombre buscado contiene el archivo (prioridad 4)
                            elif file_base in name_normalized and len(file_base) > 3:
                                possible_matches.append((4, os.path.join(root, file), file_ext))
                            # Coincidencia aproximada: sin 's' plural (prioridad 5)
                            elif file_base == name_normalized.rstrip('s') or name_normalized == file_base.rstrip('s'):
                                possible_matches.append((5, os.path.join(root, file), file_ext))
                    
                    # Ordenar por prioridad y extensión
                    if possible_matches:
                        # Debug: mostrar las coincidencias encontradas
                        print(f"Encontradas {len(possible_matches)} coincidencias:")
                        for prio, path, ext in possible_matches[:3]:
                            print(f"  {prio}: {os.path.basename(path)}")
                        
                        # Ordenar: primero por prioridad, luego por extensión preferida
                        def sort_key(match):
                            priority, path, ext = match
                            ext_priority = extensions_priority.index(ext) if ext in extensions_priority else 999
                            return (priority, ext_priority)
                        
                        possible_matches.sort(key=sort_key)
                        abs_path = possible_matches[0][1]
                        rel_path = os.path.relpath(abs_path, base_dir)
                        found_path = rel_path.replace('\\', '/')
                    else:
                        print("No se encontraron imágenes para:", platillo)
                    
                    if found_path:
                        src = found_path

            # Generar HTML de la tarjeta
            if src:
                img_content = f'<img src="{src}" alt="{platillo}" loading="lazy">'
            else:
                # Usar el logo de Tajal como imagen genérica/fallback
                img_content = '<img src="assets/images/logos/logo-fallback.jpg" alt="{platillo}" loading="lazy" class="fallback-image">'.format(platillo=platillo)

            html_content += (
                f'<div class="card">\n'
                f'  <div class="card-image">\n'
                f'    {img_content}\n'
                f'  </div>\n'
                f'  <div class="card-content">\n'
                f'    <h2>{platillo}</h2>\n'
                f'    <p>{descripcion}</p>\n'
                f'    <span class="price">{precio}</span>\n'
                f'  </div>\n'
                f'</div>\n'
            )
        html_content += '</div>\n</div>\n'

    # Cerrar la estructura del HTML
    html_content += """
    </div>
    <div class="back-to-home">
        <button id="theme-toggle" class="btn" aria-label="Activar modo oscuro"><i class="fas fa-moon"></i></button>
        <a href="index.html" class="btn"><i class="fas fa-home"></i> Volver al Inicio</a>
    </div>

    <a id="back-to-top-btn" class="back-to-top-btn" title="Volver Arriba" aria-label="Volver arriba"><i class="fas fa-arrow-up"></i></a>

    <!-- Botones flotantes de navegación -->
    <div class="floating-nav">
        <a href="index.html" class="floating-btn" title="Volver al Inicio">
            <i class="fas fa-home"></i>
        </a>
        <a href="menu-platillos.html" class="floating-btn active" title="Carta de Platillos">
            <i class="fas fa-utensils"></i>
        </a>
        <a href="menu-mixologia.html" class="floating-btn" title="Servicios de Mixología">
            <i class="fas fa-martini-glass-citrus"></i>
        </a>
    </div>

    <script src="assets/js/main.js" defer></script>
</body>
</html>
"""

    # Guardar el nuevo archivo HTML
    # Guardar el nuevo archivo HTML
    output_path = os.path.join(base_dir, 'menu-platillos.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Se ha generado el archivo 'menu-platillos.html'")

if __name__ == "__main__":
    generar_menu_platillos()
