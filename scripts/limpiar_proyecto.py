#!/usr/bin/env python3
"""
Script para limpiar archivos innecesarios del proyecto
"""

import os
import shutil
from pathlib import Path

def limpiar_proyecto(dry_run=True):
    """Limpia archivos innecesarios del proyecto"""
    
    base_dir = Path.cwd()
    
    # Lista de archivos y carpetas a eliminar
    archivos_eliminar = [
        # Scripts temporales/rotos
        'scripts/generador_mixologia_broken.py',
        'scripts/generador_mixologia_backup.py',
        
        # Archivos del sistema
        '.DS_Store',
        'assets/.DS_Store',
        'assets/images/.DS_Store',
        
        # Archivos de lock duplicados (mantener solo uno)
        'yarn.lock',  # Si usas npm, eliminar yarn.lock
        
        # Documentación vieja (si existe)
        'assets/images/missing_images.md',
    ]
    
    print(f"\n{'='*80}")
    print("LIMPIEZA DEL PROYECTO")
    print(f"{'='*80}\n")
    
    if dry_run:
        print("⚠️  MODO DRY-RUN (solo muestra qué se eliminará)")
        print("    Para eliminar realmente, ejecuta con: --delete\n")
    
    eliminados = []
    no_encontrados = []
    
    for item in archivos_eliminar:
        item_path = base_dir / item
        
        if item_path.exists():
            tipo = "📁 CARPETA" if item_path.is_dir() else "📄 ARCHIVO"
            tamaño = ""
            
            if item_path.is_file():
                size_bytes = item_path.stat().st_size
                size_kb = size_bytes / 1024
                tamaño = f" ({size_kb:.1f} KB)"
            
            print(f"🗑️  {tipo}: {item}{tamaño}")
            
            if not dry_run:
                try:
                    if item_path.is_dir():
                        shutil.rmtree(item_path)
                    else:
                        item_path.unlink()
                    eliminados.append(item)
                    print(f"    ✅ Eliminado")
                except Exception as e:
                    print(f"    ❌ Error: {e}")
        else:
            no_encontrados.append(item)
    
    print(f"\n{'='*80}")
    print("RESUMEN")
    print(f"{'='*80}")
    print(f"Total de items a procesar: {len(archivos_eliminar)}")
    
    if dry_run:
        print(f"Items a eliminar: {len(archivos_eliminar) - len(no_encontrados)}")
        print(f"No encontrados: {len(no_encontrados)}")
        print(f"\n⚠️  NO se eliminó ningún archivo (modo dry-run)")
        print(f"\nPara eliminar realmente, ejecuta:")
        print(f"    python3 scripts/limpiar_proyecto.py --delete")
    else:
        print(f"✅ Eliminados: {len(eliminados)}")
        print(f"⏭️  No encontrados: {len(no_encontrados)}")
        print(f"\n✅ Limpieza completada!")
    
    # Mostrar estructura recomendada
    print(f"\n{'='*80}")
    print("ARCHIVOS IMPORTANTES QUE SE MANTIENEN")
    print(f"{'='*80}")
    print("""
✅ Archivos esenciales del sitio:
   - index.html
   - menu-platillos.html
   - menu-mixologia.html
   - assets/css/main.css
   - assets/js/main.js
   - assets/images/
   - assets/video/

✅ Scripts útiles:
   - scripts/generador_menu.py
   - scripts/generador_mixologia.py
   - scripts/sync_from_sheets.py  
   - scripts/check_image_connections.py

✅ Datos:
   - data/menu-completo.csv (CSV único con platillos y mixología)

✅ Tests:
   - tests/test.js

✅ Configuración:
   - .gitignore
   - package.json
   - README.md
    """)

def main():
    import sys
    
    delete_mode = '--delete' in sys.argv
    limpiar_proyecto(dry_run=not delete_mode)

if __name__ == "__main__":
    main()
