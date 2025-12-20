#!/usr/bin/env python3
"""
Script para convertir imágenes específicas a formato WebP
"""
import os
import sys
from pathlib import Path

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("📦 Instalando Pillow...")
    os.system(f"{sys.executable} -m pip install pillow")
    from PIL import Image

def convert_to_webp(image_path, quality=80):
    """Convert a single image to WebP format"""
    img_path = Path(image_path)
    
    if not img_path.exists():
        print(f"❌ No existe: {img_path}")
        return False
    
    # Skip if already WebP
    if img_path.suffix.lower() == '.webp':
        print(f"⏭️  Ya es WebP: {img_path.name}")
        return True
    
    # Create WebP path
    webp_path = img_path.with_suffix('.webp')
    
    # Check if WebP version already exists
    if webp_path.exists():
        print(f"⚠️  Ya existe WebP: {webp_path.name}")
        return True
    
    try:
        # Open and convert image
        with Image.open(img_path) as im:
            # Convert palette/CMYK images to RGB
            if im.mode in ['P', 'CMYK', 'LA']:
                im = im.convert('RGB')
            elif im.mode == 'RGBA':
                # For transparent images, keep RGBA
                pass
            elif im.mode not in ['RGB', 'L']:
                im = im.convert('RGB')
            
            # Save as WebP
            im.save(webp_path, format='WEBP', quality=quality, method=6)
            
            # Get file sizes
            original_size = img_path.stat().st_size / 1024  # KB
            webp_size = webp_path.stat().st_size / 1024  # KB
            reduction = ((original_size - webp_size) / original_size) * 100
            
            print(f"✅ {img_path.name} → {webp_path.name}")
            print(f"   Tamaño: {original_size:.1f}KB → {webp_size:.1f}KB (reducción: {reduction:.1f}%)")
            return True
            
    except Exception as e:
        print(f"❌ Error convirtiendo {img_path.name}: {e}")
        return False

def main():
    print("=" * 80)
    print("CONVERSIÓN DE IMÁGENES ESPECÍFICAS A WEBP")
    print("=" * 80)
    print()
    
    # Base directory
    base_dir = Path(__file__).parent.parent
    images_dir = base_dir / 'assets' / 'images' / 'imagenes-organizadas'
    
    # Images to convert
    images_to_convert = [
        'rib-eye_350g.png',
        'ensalada_texmex.webp',
        'extra_arrachera.jpg',
        'extra_de_arroz.png',
        'extra_de_chorizo.png',
        'extra_de_panela.png',
        'extra_elotes.jpg'
    ]
    
    print(f"📂 Directorio: {images_dir}\n")
    
    converted = 0
    skipped = 0
    errors = 0
    
    for image_name in images_to_convert:
        image_path = images_dir / image_name
        result = convert_to_webp(image_path)
        
        if result:
            if image_name.endswith('.webp'):
                skipped += 1
            else:
                converted += 1
        else:
            errors += 1
        print()
    
    print("=" * 80)
    print("📊 RESUMEN")
    print("=" * 80)
    print(f"✅ Convertidas: {converted}")
    print(f"⏭️  Ya eran WebP: {skipped}")
    print(f"❌ Errores: {errors}")
    print("=" * 80)

if __name__ == '__main__':
    main()
