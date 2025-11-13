import pandas as pd
import os
from datetime import datetime

# Función para estandarizar precios
def clean_price(price):
    if pd.isna(price) or price == '':
        return ''
    # Remover comas, espacios y símbolos de moneda
    price_str = str(price).replace('$', '').replace(',', '').strip()
    try:
        # Convertir a float y redondear a 2 decimales
        return f"${float(price_str):.2f}"
    except ValueError:
        return ''

# Función para limpiar y estandarizar texto
def clean_text(text):
    if pd.isna(text) or text == '':
        return ''
    # Capitalizar la primera letra y el resto en minúsculas
    return ' '.join(word.capitalize() for word in str(text).split())

# Crear copia de seguridad
def create_backup(file_path):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.backup_{timestamp}"
    os.rename(file_path, backup_path)
    print(f"Copia de seguridad creada: {backup_path}")
    return backup_path

# Procesar archivo de platillos
def fix_platillos():
    file_path = 'Carta_TAJAL - PLATILLOS.csv'
    backup_path = create_backup(file_path)
    
    # Leer el archivo
    df = pd.read_csv(backup_path)
    
    # Estandarizar categorías
    category_corrections = {
        'Mariscos ': 'Mariscos',
        'Mariscos  ': 'Mariscos',
        'Postres ': 'Postres',
        'Extras ': 'Extras'
    }
    
    df['CATEGORIAS'] = df['CATEGORIAS'].replace(category_corrections)
    
    # Estandarizar precios
    df['PRECIO'] = df['PRECIO'].apply(clean_price)
    
    # Corregir descripciones
    description_corrections = {
        'diferenes cada dia': 'Diferentes cada día',
        'Flan Napolitano de platano macho, Flan Napolitano de vainilla': 'Flan Napolitano de plátano macho o vainilla',
        'de Cheesecake, de limon': 'Cheesecake o de limón',
        'Con una ensalada especial de la casa': 'Acompañado de una ensalada especial de la casa'
    }
    
    for key, value in description_corrections.items():
        df['DESCRIPCION'] = df['DESCRIPCION'].str.replace(key, value, regex=False)
    
    # Guardar archivo corregido
    df.to_csv(file_path, index=False, encoding='utf-8')
    print(f"Archivo {file_path} corregido exitosamente")

# Procesar archivo de bebidas
def fix_bebidas():
    file_path = 'Carta_TAJAL - BEBIDAS_Y_MIXOLOGIA.csv'
    backup_path = create_backup(file_path)
    
    # Leer el archivo
    df = pd.read_csv(backup_path)
    
    # Estandarizar categorías
    df['CATEGORIA'] = df['CATEGORIA'].replace({
        'Cocteleria': 'Coctelería',
        'Coctelería ': 'Coctelería',
        'Coctelería  ': 'Coctelería'
    })
    
    # Estandarizar precios
    for col in ['PRECIO/BOTELLA', 'PRECIO/COPA']:
        if col in df.columns:
            df[col] = df[col].apply(clean_price)
    
    # Corregir nombres de cócteles
    df['NOMBRE'] = df['NOMBRE'].str.strip()
    
    # Unificar precios para productos duplicados
    price_unification = {
        'Sangría': '$150.00',
        'Bloody Mary': '$150.00',
        'Maracay': '$195.00',
        'Maracuyita': '$185.00'
    }
    
    for name, price in price_unification.items():
        mask = df['NOMBRE'].str.contains(name, case=False, na=False)
        df.loc[mask, 'PRECIO/COPA'] = price
    
    # Corregir descripciones
    desc_corrections = {
        'especial especial': 'especial',
        'limon': 'limón',
        'espresso': 'expreso',
        'miel de maple': 'miel de arce',
        'maracuya': 'maracuyá',
        'jigo': 'higo'
    }
    
    for key, value in desc_corrections.items():
        df['DESCRIPCION'] = df['DESCRIPCION'].str.replace(key, value, case=False, regex=False)
    
    # Eliminar duplicados
    df = df.drop_duplicates(subset=['NOMBRE', 'CATEGORIA', 'SUBCATEGORIA'], keep='first')
    
    # Guardar archivo corregido
    df.to_csv(file_path, index=False, encoding='utf-8')
    print(f"Archivo {file_path} corregido exitosamente")

if __name__ == "__main__":
    print("Iniciando corrección de archivos del menú...")
    fix_platillos()
    fix_bebidas()
    print("Proceso completado. Se han creado copias de seguridad de los archivos originales.")
