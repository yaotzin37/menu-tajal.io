#!/usr/bin/env python3
"""
Script para generar mapeo automático de imágenes basado en nombres de platillos
"""
import pandas as pd
import os
from pathlib import Path
import re

def normalizar_nombre(texto):
    """Normaliza un nombre para comparación"""
    # Convertir a minúsculas
    texto = str(texto).lower()
    # Eliminar acentos
    texto = texto.replace('á', 'a').replace('é', 'e').replace('í', 'i')
    texto = texto.replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    # Eliminar espacios y caracteres especiales
    texto = re.sub(r'[^a-z0-9]', '_', texto)
    # Eliminar guiones bajos múltiples
    texto = re.sub(r'_+', '_', texto)
    # Eliminar guiones al inicio y final
    texto = texto.strip('_')
    return texto

def encontrar_imagen(nombre_platillo, imagenes_disponibles):
    """Encuentra la mejor coincidencia de imagen para un platillo"""
    nombre_norm = normalizar_nombre(nombre_platillo)
    
    # Buscar coincidencia exacta
    for img in imagenes_disponibles:
        img_norm = normalizar_nombre(img.replace('.webp', ''))
        if nombre_norm == img_norm:
            return img
    
    # Buscar coincidencia parcial (el nombre del platillo está en la imagen)
    for img in imagenes_disponibles:
        img_norm = normalizar_nombre(img.replace('.webp', ''))
        if nombre_norm in img_norm or img_norm in nombre_norm:
            return img
    
    # Buscar por palabras clave
    palabras_platillo = nombre_norm.split('_')
    mejores_coincidencias = []
    
    for img in imagenes_disponibles:
        img_norm = normalizar_nombre(img.replace('.webp', ''))
        palabras_img = img_norm.split('_')
        
        # Contar palabras en común
        coincidencias = sum(1 for p in palabras_platillo if p in palabras_img and len(p) > 2)
        
        if coincidencias > 0:
            mejores_coincidencias.append((img, coincidencias))
    
    if mejores_coincidencias:
        # Ordenar por número de coincidencias y retornar la mejor
        mejores_coincidencias.sort(key=lambda x: x[1], reverse=True)
        return mejores_coincidencias[0][0]
    
    return None

def main():
    base_dir = Path(__file__).parent.parent
    csv_path = base_dir / 'data' / 'menu-completo.csv'
    imagenes_dir = base_dir / 'assets' / 'images' / 'menu' / 'imagenes-organizadas'
    
    # Leer CSV
    print("📄 Leyendo CSV...")
    df = pd.read_csv(csv_path)
    
    # Obtener lista de imágenes
    print("🖼️  Escaneando imágenes...")
    imagenes = [f.name for f in imagenes_dir.glob('*.webp') if not f.name.startswith('.')]
    print(f"   Encontradas {len(imagenes)} imágenes")
    
    # Crear columna de imágenes si no existe
    if 'Imagen' not in df.columns:
        df['Imagen'] = ''
    
    # Mapear imágenes
    print("\n🔍 Mapeando imágenes automáticamente...")
    encontradas = 0
    no_encontradas = []
    
    for idx, row in df.iterrows():
        nombre = row['Nombre']
        imagen_actual = row.get('Imagen', '')
        
        # Si ya tiene imagen asignada, no cambiar
        if pd.notna(imagen_actual) and str(imagen_actual).strip():
            encontradas += 1
            continue
        
        # Buscar imagen
        imagen = encontrar_imagen(nombre, imagenes)
        
        if imagen:
            df.at[idx, 'Imagen'] = imagen
            encontradas += 1
            print(f"  ✅ {nombre} → {imagen}")
        else:
            no_encontradas.append(nombre)
            print(f"  ❌ {nombre} → SIN IMAGEN")
    
    # Guardar CSV actualizado
    output_path = base_dir / 'data' / 'menu-completo-con-imagenes.csv'
    df.to_csv(output_path, index=False)
    
    print(f"\n{'='*80}")
    print("RESUMEN")
    print(f"{'='*80}")
    print(f"✅ Imágenes encontradas: {encontradas}/{len(df)}")
    print(f"❌ Sin imagen: {len(no_encontradas)}")
    
    if no_encontradas:
        print(f"\n⚠️  Platillos sin imagen:")
        for nombre in no_encontradas[:10]:  # Mostrar solo los primeros 10
            print(f"   - {nombre}")
        if len(no_encontradas) > 10:
            print(f"   ... y {len(no_encontradas) - 10} más")
    
    print(f"\n📁 CSV guardado en: {output_path}")
    print(f"\n💡 Revisa el archivo y luego:")
    print(f"   1. Copia el contenido a Google Sheets")
    print(f"   2. O renombra a 'menu-completo.csv' para usar localmente")

if __name__ == '__main__':
    main()
