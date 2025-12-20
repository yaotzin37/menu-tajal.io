import os
from pathlib import Path

def ensure_pillow():
    import sys
    try:
        import PIL  # noqa: F401
    except Exception:
        os.system(f"{sys.executable} -m pip install pillow")

def convert_assets_to_webp(base_dir):
    from PIL import Image
    assets_dir = base_dir / 'assets' / 'images' / 'menu'
    converted = 0
    skipped = 0
    
    print(f"\n🔄 Convirtiendo imágenes a WebP en: {assets_dir}")
    
    for img_path in assets_dir.rglob('*'):
        if not img_path.is_file():
            continue
        ext = img_path.suffix.lower()
        if ext in ['.jpg', '.jpeg', '.png']:
            webp_path = img_path.with_suffix('.webp')
            if webp_path.exists():
                skipped += 1
                continue
            try:
                im = Image.open(img_path)
                if im.mode in ['P', 'CMYK']:
                    im = im.convert('RGB')
                im.save(webp_path, format='WEBP', quality=80, method=6)
                print(f"  ✅ Convertido: {img_path.name} → {webp_path.name}")
                converted += 1
            except Exception as e:
                print(f"  ❌ Error en {img_path.name}: {e}")
    
    print(f"\n📊 Resumen:")
    print(f"  • Convertidas: {converted}")
    print(f"  • Ya existían: {skipped}")
    return converted

def find_webp_for_basename(base_dir, basename):
    for p in (base_dir / 'assets' / 'images' / 'menu').rglob('*.webp'):
        if p.stem.lower() == Path(basename).stem.lower():
            return p.name
    return None

def update_csv_images(csv_path, image_columns):
    import sys
    try:
        import pandas as pd
    except Exception:
        os.system(f"{sys.executable} -m pip install pandas")
        import pandas as pd
    
    if not csv_path.exists():
        print(f"⚠️  CSV no encontrado: {csv_path}")
        return
    
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"❌ Error leyendo CSV: {e}")
        return
    
    updated = False
    changes = 0
    
    for col in image_columns:
        if col in df.columns:
            def _fix(x):
                nonlocal changes
                s = str(x).strip()
                if not s or s == 'nan':
                    return x
                if s.lower().endswith(('.jpg', '.jpeg', '.png')):
                    w = find_webp_for_basename(Path(csv_path).parent.parent, s)
                    if w and w != s:
                        changes += 1
                        return w
                return x
            df[col] = df[col].apply(_fix)
            updated = True
    
    if updated and changes > 0:
        df.to_csv(csv_path, index=False)
        print(f"  ✅ Actualizado {csv_path.name}: {changes} referencias cambiadas a .webp")
    elif updated:
        print(f"  ℹ️  {csv_path.name}: Sin cambios necesarios")

def main():
    base_dir = Path(__file__).parent.parent
    
    print("="*80)
    print("CONVERSIÓN DE IMÁGENES A WEBP")
    print("="*80)
    
    ensure_pillow()
    converted = convert_assets_to_webp(base_dir)
    
    if converted > 0:
        print(f"\n📝 Actualizando referencias en CSVs...")
        image_cols = ['IMAGES', 'IMAGEN', 'IMAGENES', 'IMAGE']
        
        # Actualizar el CSV único
        update_csv_images(base_dir / 'data' / 'menu-completo.csv', image_cols)
    else:
        print(f"\n✅ Todas las imágenes ya están en formato WebP")
    
    print("\n" + "="*80)
    print("✅ PROCESO COMPLETADO")
    print("="*80)

if __name__ == '__main__':
    main()

