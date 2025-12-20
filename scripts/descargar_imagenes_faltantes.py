import pandas as pd
import os
import requests
import re
from pathlib import Path

def descargar_imagen_desde_drive(drive_url, nombre_archivo, carpeta_destino):
    """
    Descarga una imagen desde Google Drive usando el enlace compartido.
    """
    # Extraer el ID del archivo de Google Drive del enlace
    match = re.search(r'/d/([a-zA-Z0-9_-]+)/', drive_url)
    if not match:
        print(f"  ❌ No se pudo extraer el ID del enlace: {drive_url}")
        return False
    
    file_id = match.group(1)
    
    # URL de descarga directa de Google Drive
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    # Crear la ruta completa del archivo
    ruta_completa = os.path.join(carpeta_destino, nombre_archivo)
    
    try:
        # Descargar el archivo
        response = requests.get(download_url, stream=True)
        
        # Verificar si la descarga fue exitosa
        if response.status_code == 200:
            # Guardar el archivo
            with open(ruta_completa, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"  ✓ Descargado: {nombre_archivo}")
            return True
        else:
            print(f"  ❌ Error al descargar {nombre_archivo}: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Error al descargar {nombre_archivo}: {str(e)}")
        return False


def main():
    """
    Descarga las imágenes que faltan desde Google Drive.
    """
    # Obtener la ruta base del proyecto
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Rutas
    csv_imagenes = os.path.join(base_dir, 'data', 'IMAGENES - assets.csv')
    assets_dir = os.path.join(base_dir, 'assets', 'images', 'menu')
    
    # Leer el CSV con los enlaces de Google Drive
    try:
        df = pd.read_csv(csv_imagenes)
    except FileNotFoundError:
        print(f"❌ No se encontró el archivo: {csv_imagenes}")
        return
    
    print("="*70)
    print("DESCARGA DE IMÁGENES FALTANTES DESDE GOOGLE DRIVE")
    print("="*70)
    print(f"\nTotal de imágenes en el CSV: {len(df)}")
    
    # Crear un set de todas las imágenes que ya existen en el proyecto
    imagenes_existentes = set()
    for root, dirs, files in os.walk(assets_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg')):
                imagenes_existentes.add(file.lower())
    
    print(f"Imágenes ya existentes en el proyecto: {len(imagenes_existentes)}")
    
    # Determinar qué categoría usar según el nombre del archivo
    def determinar_carpeta(nombre_archivo):
        nombre_lower = nombre_archivo.lower()
        
        # Mixología / Bebidas
        if any(x in nombre_lower for x in ['coctel', 'margarita', 'mojito', 'michelada', 'sangria', 
                                             'mimosa', 'clericot', 'manhattan', 'martini', 'modelo',
                                             'cerveza', 'negra', 'pacifico', 'tequila', 'mezcal',
                                             'vodka', 'whisky', 'ron', 'ginebra', 'licor', 'aperol',
                                             'bloody', 'carajillo', 'rey_abel', 'perla', 'vampiro',
                                             'old_fashion', 'cuba_libre', 'maracay', 'flor_de_durazno',
                                             'violet_bomb', 'coneja', 'durazno', 'bomba']):
            return 'mixologia'
        
        # Desayunos
        if any(x in nombre_lower for x in ['chilaquiles', 'huevos', 'hotcakes', 'hot-cakes', 
                                             'molletes', 'desayunos', 'fruta']):
            return 'desayunos'
        
        # Cortes
        if any(x in nombre_lower for x in ['cowboy', 'tomahawk', 'rib_eye', 't-bone', 'arrachera', 
                                             'picana', 'picaña']):
            return 'cortes'
        
        # Mariscos
        if any(x in nombre_lower for x in ['camaron', 'pulpo', 'salmon', 'atun', 'aguachile', 
                                             'tiradito', 'gobernador', 'torre']):
            return 'mariscos'
        
        # Ensaladas
        if any(x in nombre_lower for x in ['ensalada', 'cesar', 'capres', 'texmex']):
            return 'ensaladas'
        
        # Pastas
        if any(x in nombre_lower for x in ['pasta', 'alfredo', 'arrabiata', 'pesto', 'bizarro']):
            return 'pastas'
        
        # Hamburguesas
        if any(x in nombre_lower for x in ['hamburguesa', 'burger']):
            return 'hamburguesas'
        
        # Entradas
        if any(x in nombre_lower for x in ['guacamole', 'tuetanos', 'cecina', 'queso_fundido',
                                             'panela', 'chistorra', 'tostada', 'sopa', 'frijoles',
                                             'papas', 'pelliscada']):
            return 'entradas'
        
        # Postres
        if any(x in nombre_lower for x in ['flan', 'pay', 'pastel']):
            return 'postres'
        
        # Infantil
        if any(x in nombre_lower for x in ['infantil', 'nuggets', 'hot_dog', 'hotdog']):
            return 'infantil'
        
        # Menudo/Especiales
        if any(x in nombre_lower for x in ['menudo', 'caldo']):
            return 'especiales'
        
        # Default: otros
        return 'otros'
    
    # Buscar y descargar imágenes faltantes
    imagenes_descargadas = 0
    imagenes_omitidas = 0
    imagenes_error = 0
    
    print("\n" + "="*70)
    print("DESCARGANDO IMÁGENES FALTANTES...")
    print("="*70 + "\n")
    
    for _, row in df.iterrows():
        nombre_imagen = row['IMAGEN'].strip()
        link_drive = row['LINK_ORIGINAL']
        
        # Verificar si la imagen ya existe
        if nombre_imagen.lower() in imagenes_existentes:
            imagenes_omitidas += 1
            continue
        
        # Determinar la carpeta de destino
        categoria = determinar_carpeta(nombre_imagen)
        carpeta_destino = os.path.join(assets_dir, categoria)
        
        # Crear la carpeta si no existe
        os.makedirs(carpeta_destino, exist_ok=True)
        
        print(f"[{categoria}] {nombre_imagen}")
        
        # Descargar la imagen
        if descargar_imagen_desde_drive(link_drive, nombre_imagen, carpeta_destino):
            imagenes_descargadas += 1
        else:
            imagenes_error += 1
    
    print("\n" + "="*70)
    print("RESUMEN DE DESCARGA")
    print("="*70)
    print(f"✓ Imágenes descargadas: {imagenes_descargadas}")
    print(f"⊘ Imágenes ya existentes (omitidas): {imagenes_omitidas}")
    print(f"✗ Errores de descarga: {imagenes_error}")
    print(f"\nTotal procesado: {imagenes_descargadas + imagenes_omitidas + imagenes_error}/{len(df)}")


if __name__ == "__main__":
    main()
