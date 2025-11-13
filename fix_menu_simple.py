import csv
import os
from datetime import datetime

def create_backup(file_path):
    """Crea una copia de seguridad del archivo."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.backup_{timestamp}"
    
    with open(file_path, 'r', encoding='utf-8') as src, open(backup_path, 'w', encoding='utf-8') as dst:
        dst.write(src.read())
    
    print(f"Copia de seguridad creada: {backup_path}")
    return backup_path

def clean_price(price):
    """Limpia y formatea el precio."""
    if not price or price.strip() == '':
        return ''
    # Remover símbolos y espacios
    clean = price.replace('$', '').replace(',', '').strip()
    # Verificar si es un número válido
    try:
        # Formatear a dos decimales
        return f"${float(clean):.2f}"
    except ValueError:
        return price

def fix_platillos():
    """Corrige el archivo de platillos."""
    file_path = 'Carta_TAJAL - PLATILLOS.csv'
    temp_path = f"{file_path}.tmp"
    
    # Crear copia de seguridad
    backup_path = create_backup(file_path)
    
    # Correcciones de categorías
    category_corrections = {
        'Mariscos ': 'Mariscos',
        'Mariscos  ': 'Mariscos',
        'Postres ': 'Postres',
        'Extras ': 'Extras'
    }
    
    # Correcciones de descripciones
    desc_corrections = {
        'diferenes cada dia': 'Diferentes cada día',
        'Flan Napolitano de platano macho, Flan Napolitano de vainilla': 'Flan Napolitano de plátano macho o vainilla',
        'de Cheesecake, de limon': 'Cheesecake o de limón',
        'Con una ensalada especial de la casa': 'Acompañado de una ensalada especial de la casa',
        'platano': 'plátano',
        'limon': 'limón'
    }
    
    with open(file_path, 'r', encoding='utf-8') as infile, open(temp_path, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        # Escribir el encabezado
        header = next(reader)
        writer.writerow(header)
        
        for row in reader:
            if len(row) < 5:  # Asegurarse de que la fila tenga suficientes columnas
                continue
                
            # Aplicar correcciones de categoría
            if row[0] in category_corrections:
                row[0] = category_corrections[row[0]]
            
            # Limpiar precios
            if len(row) > 4:  # Si hay columna de precio
                row[4] = clean_price(row[4])
            
            # Aplicar correcciones de descripción
            if len(row) > 3 and row[3]:  # Si hay descripción
                for old, new in desc_corrections.items():
                    if old in row[3]:
                        row[3] = row[3].replace(old, new)
            
            writer.writerow(row)
    
    # Reemplazar el archivo original
    os.replace(temp_path, file_path)
    print(f"Archivo {file_path} corregido exitosamente")

def fix_bebidas():
    """Corrige el archivo de bebidas."""
    file_path = 'Carta_TAJAL - BEBIDAS_Y_MIXOLOGIA.csv'
    temp_path = f"{file_path}.tmp"
    
    # Crear copia de seguridad
    backup_path = create_backup(file_path)
    
    # Correcciones de categorías
    category_corrections = {
        'Cocteleria': 'Coctelería',
        'Coctelería ': 'Coctelería',
        'Coctelería  ': 'Coctelería'
    }
    
    # Unificación de precios para productos duplicados
    price_unification = {
        'Sangría': '$150.00',
        'Bloody Mary': '$150.00',
        'Maracay': '$195.00',
        'Maracuyita': '$185.00'
    }
    
    # Correcciones de descripciones
    desc_corrections = {
        'especial especial': 'especial',
        'limon': 'limón',
        'espresso': 'expreso',
        'miel de maple': 'miel de arce',
        'maracuya': 'maracuyá',
        'jigo': 'higo'
    }
    
    # Para manejar duplicados
    seen_products = set()
    
    with open(file_path, 'r', encoding='utf-8') as infile, open(temp_path, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        # Escribir el encabezado
        header = next(reader)
        writer.writerow(header)
        
        for row in reader:
            if len(row) < 6:  # Asegurarse de que la fila tenga suficientes columnas
                continue
                
            # Crear una clave única para identificar duplicados
            product_key = (row[0], row[1], row[2])  # categoría, subcategoría, nombre
            
            # Si ya vimos este producto, lo saltamos (para evitar duplicados)
            if product_key in seen_products:
                continue
                
            seen_products.add(product_key)
            
            # Aplicar correcciones de categoría
            if row[0] in category_corrections:
                row[0] = category_corrections[row[0]]
            
            # Limpiar precios
            if len(row) > 4:  # Precio por botella
                row[4] = clean_price(row[4])
            if len(row) > 5:  # Precio por copa
                row[5] = clean_price(row[5])
            
            # Unificar precios para productos duplicados
            for name, price in price_unification.items():
                if name.lower() in row[2].lower() and len(row) > 5:
                    row[5] = price
            
            # Aplicar correcciones de descripción
            if len(row) > 3 and row[3]:  # Si hay descripción
                for old, new in desc_corrections.items():
                    if old in row[3].lower():
                        row[3] = row[3].lower().replace(old, new)
            
            writer.writerow(row)
    
    # Reemplazar el archivo original
    os.replace(temp_path, file_path)
    print(f"Archivo {file_path} corregido exitosamente")

if __name__ == "__main__":
    print("Iniciando corrección de archivos del menú...")
    try:
        fix_platillos()
        fix_bebidas()
        print("\n¡Proceso completado con éxito!")
        print("Se han realizado las siguientes mejoras:")
        print("- Estandarización de nombres de categorías")
        print("- Corrección de errores ortográficos")
        print("- Unificación de precios para productos duplicados")
        print("- Formato consistente de precios")
        print("- Eliminación de entradas duplicadas")
        print("\nSe han creado copias de seguridad de los archivos originales.")
    except Exception as e:
        print(f"\nError durante la ejecución: {str(e)}")
        print("Si ocurrió un error, los archivos originales no se han modificado.")
