#!/usr/bin/env python3
"""
Script para verificar las conexiones de imágenes en los archivos HTML de menús
Identifica imágenes faltantes o con rutas incorrectas
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

def extract_image_refs_from_html(html_file: Path) -> List[Tuple[str, str, int]]:
    """
    Extrae todas las referencias de imágenes de un archivo HTML
    Retorna: Lista de tuplas (ruta_imagen, alt_text, número_de_línea)
    """
    image_refs = []
    with open(html_file, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            # Buscar etiquetas <img src="...">
            img_matches = re.finditer(r'<img\s+src="([^"]+)"\s+alt="([^"]*)"', line)
            for match in img_matches:
                image_refs.append((match.group(1), match.group(2), line_num))
    return image_refs

def check_image_exists(base_path: Path, image_path: str) -> bool:
    """Verifica si una imagen existe en el sistema de archivos"""
    full_path = base_path / image_path
    return full_path.exists()

def find_similar_images(base_path: Path, image_name: str) -> List[str]:
    """Busca imágenes con nombres similares en el directorio"""
    menu_images_dir = base_path / "assets" / "images" / "menu"
    similar = []
    
    if not menu_images_dir.exists():
        return similar
    
    # Extraer el nombre base sin extensión
    base_name = Path(image_name).stem.lower()
    
    # Buscar recursivamente en el directorio de imágenes
    for img_file in menu_images_dir.rglob("*.webp"):
        if base_name in img_file.stem.lower():
            # Generar ruta relativa desde la raíz del proyecto
            rel_path = img_file.relative_to(base_path)
            similar.append(str(rel_path))
    
    return similar

def analyze_menu_html(html_file: Path, base_path: Path) -> Dict:
    """Analiza un archivo HTML de menú y retorna un reporte"""
    print(f"\n{'='*80}")
    print(f"Analizando: {html_file.name}")
    print(f"{'='*80}\n")
    
    image_refs = extract_image_refs_from_html(html_file)
    
    report = {
        'file': str(html_file.name),
        'total_images': len(image_refs),
        'missing_images': [],
        'found_images': [],
        'suggestions': {}
    }
    
    for img_path, alt_text, line_num in image_refs:
        exists = check_image_exists(base_path, img_path)
        
        if exists:
            report['found_images'].append({
                'path': img_path,
                'alt': alt_text,
                'line': line_num
            })
        else:
            # Buscar imágenes similares
            similar = find_similar_images(base_path, img_path)
            
            report['missing_images'].append({
                'path': img_path,
                'alt': alt_text,
                'line': line_num
            })
            
            if similar:
                report['suggestions'][img_path] = similar
    
    return report

def print_report(report: Dict):
    """Imprime el reporte de manera legible"""
    print(f"Total de referencias de imágenes: {report['total_images']}")
    print(f"✅ Imágenes encontradas: {len(report['found_images'])}")
    print(f"❌ Imágenes faltantes: {len(report['missing_images'])}")
    
    if report['missing_images']:
        print(f"\n{'─'*80}")
        print("IMÁGENES FALTANTES:")
        print(f"{'─'*80}")
        
        for img in report['missing_images']:
            print(f"\n❌ Línea {img['line']}: {img['path']}")
            print(f"   Alt text: {img['alt']}")
            
            # Mostrar sugerencias si existen
            if img['path'] in report['suggestions']:
                print(f"   💡 Imágenes similares encontradas:")
                for suggestion in report['suggestions'][img['path']][:3]:  # Mostrar solo las 3 primeras
                    print(f"      - {suggestion}")
    
    print(f"\n{'─'*80}")

def main():
    """Función principal"""
    # La base es el directorio raíz del proyecto (un nivel arriba de scripts/)
    base_path = Path(__file__).parent.parent
    
    # Archivos HTML a analizar (están en la raíz del proyecto)
    html_files = [
        base_path / "menu-platillos.html",
        base_path / "menu-mixologia.html"
    ]
    
    all_reports = []
    
    for html_file in html_files:
        if not html_file.exists():
            print(f"⚠️  Archivo no encontrado: {html_file}")
            continue
        
        report = analyze_menu_html(html_file, base_path)
        print_report(report)
        all_reports.append(report)
    
    # Resumen general
    print(f"\n{'='*80}")
    print("RESUMEN GENERAL")
    print(f"{'='*80}")
    
    total_images = sum(r['total_images'] for r in all_reports)
    total_missing = sum(len(r['missing_images']) for r in all_reports)
    total_found = sum(len(r['found_images']) for r in all_reports)
    
    print(f"Total de imágenes referenciadas en ambos menús: {total_images}")
    print(f"✅ Total encontradas: {total_found}")
    print(f"❌ Total faltantes: {total_missing}")
    
    if total_missing > 0:
        percentage_missing = (total_missing / total_images) * 100
        print(f"\n⚠️  {percentage_missing:.1f}% de las imágenes tienen problemas")
    else:
        print("\n✅ Todas las imágenes están correctamente conectadas!")

if __name__ == "__main__":
    main()
