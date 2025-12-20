#!/usr/bin/env python3
"""
Script para sincronizar el menú desde Google Sheets
Descarga el CSV publicado y regenera los HTMLs
"""
import sys
import os
import urllib.request
import subprocess

# URL del Google Sheet publicado como CSV
# Para obtener esta URL:
# 1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1ljvCQoNl-uDJFGhsp44OyXFgQA7LusTK1aCv4_Ge7j8/edit
# 2. Archivo > Compartir > Publicar en la web
# 3. Selecciona la pestaña correcta y formato CSV
# 4. Copia el enlace generado y reemplázalo aquí
MENU_CSV_URL = "https://docs.google.com/spreadsheets/d/1ljvCQoNl-uDJFGhsp44OyXFgQA7LusTK1aCv4_Ge7j8/export?format=csv&gid=0"

# Ruta del CSV en el proyecto
CSV_FILENAME = "menu-completo.csv"

# Directorios
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
CSV_PATH = os.path.join(DATA_DIR, CSV_FILENAME)

PYTHON = sys.executable


def download_csv(url: str, dest_path: str):
    """Descarga el CSV desde Google Sheets"""
    if not url:
        raise ValueError("URL del Google Sheet no configurada. Edita MENU_CSV_URL en este script.")
    
    print(f"📥 Descargando desde Google Sheets...")
    print(f"   URL: {url}")
    
    try:
        with urllib.request.urlopen(url) as resp:
            data = resp.read()
        
        # Asegurar que el directorio data/ existe
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        with open(dest_path, "wb") as f:
            f.write(data)
        
        print(f"✅ Descargado: {CSV_FILENAME} ({len(data)} bytes)")
        return True
    except urllib.error.HTTPError as e:
        print(f"❌ Error HTTP {e.code}: {e.reason}")
        print(f"   Verifica que el Google Sheet esté publicado correctamente")
        return False
    except Exception as e:
        print(f"❌ Error al descargar: {e}")
        return False


def run_generator(script_name: str):
    """Ejecuta un script generador"""
    script_path = os.path.join(SCRIPT_DIR, script_name)
    print(f"\n🔨 Ejecutando: {script_name}")
    
    result = subprocess.run([PYTHON, script_path], cwd=PROJECT_ROOT)
    
    if result.returncode != 0:
        print(f"❌ Error ejecutando {script_name} (código {result.returncode})")
        return False
    return True


def main():
    """Función principal"""
    print("="*80)
    print("SINCRONIZACIÓN DESDE GOOGLE SHEETS")
    print("="*80)
    
    # 1) Descargar CSV
    if not download_csv(MENU_CSV_URL, CSV_PATH):
        print("\n❌ Sincronización fallida")
        sys.exit(1)
    
    # 2) Generar HTMLs
    print("\n" + "="*80)
    print("GENERANDO MENÚS")
    print("="*80)
    
    success = True
    success = run_generator("generador_menu.py") and success
    success = run_generator("generador_mixologia.py") and success
    
    if success:
        print("\n" + "="*80)
        print("✅ SINCRONIZACIÓN COMPLETADA")
        print("="*80)
        print("\nArchivos generados:")
        print("  • menu-platillos.html")
        print("  • menu-mixologia.html")
    else:
        print("\n❌ Algunos generadores fallaron")
        sys.exit(1)


if __name__ == "__main__":
    main()

