import re
import xml.etree.ElementTree as ET
from xml.dom import minidom

# --- Mapeo de categorías a códigos ---
GRUPOS = {
    "Desayunos": "01",
    "Entradas": "02",
    "Ensaladas": "03",
    "Pastas": "04",
    "Hamburguesas": "05",
    "Cortes": "06",
    "Del Mar": "07",
    "Menú Infantil": "08",
    "Postres": "09",
    "Bebidas": "10",
    "Extras": "11"
}

# Normalización de nombres de categoría (por si hay variaciones)
CATEGORIA_NORMAL = {
    "Infantil": "Menú Infantil"
}

def limpiar_precio(precio_str):
    # Elimina $, comas y espacios; convierte a float
    precio_str = re.sub(r'[^\d.]', '', precio_str)
    return float(precio_str)

def normalizar_texto(texto):
    # Elimina saltos de línea y espacios extra
    return re.sub(r'\s+', ' ', texto.strip())

def parsear_carta(ruta_archivo):
    with open(ruta_archivo, 'r', encoding='utf-8') as f:
        lineas = [line.rstrip() for line in f if line.strip()]
    
    productos = []
    categoria_actual = None
    i = 0

    while i < len(lineas):
        linea = lineas[i]

        # Detectar categoría
        if linea in GRUPOS or linea in CATEGORIA_NORMAL:
            categoria_actual = CATEGORIA_NORMAL.get(linea, linea)
            i += 1
            continue

        if categoria_actual is None:
            i += 1
            continue

        nombre = linea
        descripcion = ""
        precio = None

        # Mirar siguiente línea
        if i + 1 < len(lineas):
            sig = lineas[i + 1]
            # Si la siguiente línea es un precio
            if re.match(r'^\$\d', sig):
                precio = limpiar_precio(sig)
                i += 2
            # Si la siguiente línea parece descripción (no es categoría ni precio)
            elif not (sig in GRUPOS or sig in CATEGORIA_NORMAL or re.match(r'^\$\d', sig)):
                descripcion = normalizar_texto(sig)
                # Ver si la siguiente después de la descripción es precio
                if i + 2 < len(lineas) and re.match(r'^\$\d', lineas[i + 2]):
                    precio = limpiar_precio(lineas[i + 2])
                    i += 3
                else:
                    # No hay precio → error, saltar
                    i += 2
                    continue
            else:
                # No hay descripción, pero sí precio
                if re.match(r'^\$\d', sig):
                    precio = limpiar_precio(sig)
                    i += 2
                else:
                    i += 1
                    continue
        else:
            i += 1
            continue

        if precio is not None:
            productos.append({
                "categoria": categoria_actual,
                "nombre": nombre,
                "descripcion": descripcion,
                "precio": precio
            })
        else:
            i += 1

    return productos

def crear_xml(productos, salida="menu_tajal.xml"):
    # Crear raíz
    root = ET.Element("VFPData")

    # Añadir esquema (como CDATA no es soportado fácil, lo insertamos como string al final)
    # Por ahora omitimos el xsd:schema en la generación dinámica (se puede pegar al inicio)

    # Contador por grupo
    contadores = {grupo: 1 for grupo in GRUPOS.values()}

    for prod in productos:
        grupo_nombre = prod["categoria"]
        if grupo_nombre not in GRUPOS:
            continue
        grupo_codigo = GRUPOS[grupo_nombre]
        clave = f"{grupo_codigo}{contadores[grupo_codigo]:02d}"
        contadores[grupo_codigo] += 1

        curtemp = ET.SubElement(root, "curtemp")

        ET.SubElement(curtemp, "clave").text = clave
        ET.SubElement(curtemp, "descripcion").text = prod["nombre"].upper()
        ET.SubElement(curtemp, "grupo").text = grupo_codigo
        nombrecorto = prod["nombre"][:20] if len(prod["nombre"]) > 20 else prod["nombre"]
        ET.SubElement(curtemp, "nombrecorto").text = nombrecorto.upper()
        ET.SubElement(curtemp, "precio").text = f"{prod['precio']:.4f}"
        ET.SubElement(curtemp, "iva").text = "0.00"
        ET.SubElement(curtemp, "bloqueado").text = "false"
        ET.SubElement(curtemp, "comentario").text = ""
        ET.SubElement(curtemp, "precioabierto").text = "2"
        ET.SubElement(curtemp, "nofacturable").text = "false"
        ET.SubElement(curtemp, "canjeablepuntos").text = "false"
        ET.SubElement(curtemp, "preciopuntos").text = "0.0000"
        ET.SubElement(curtemp, "puntoscanje").text = "0.0000"
        ET.SubElement(curtemp, "puntosextras").text = "0.0000"
        ET.SubElement(curtemp, "plu").text = ""

        # Horarios por defecto
        dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
        for d in dias:
            ET.SubElement(curtemp, f"{d}inicio").text = "12:00:00 AM"
            ET.SubElement(curtemp, f"{d}fin").text = "12:00:00 AM"
            ET.SubElement(curtemp, f"precio{d}").text = "0.0000"
            ET.SubElement(curtemp, f"{d}diasalida").text = "1"
            ET.SubElement(curtemp, f"aplica{d}").text = "false"

        ET.SubElement(curtemp, "excentoimpuestos").text = "false"
        # secuenciacompuesto: true si tiene opciones (palabras como "o", "con", etc.)
        desc = prod["nombre"].lower()
        secuencia = "true" if any(kw in desc for kw in ["al gusto", "o ", "con "]) else "false"
        ET.SubElement(curtemp, "secuenciacompuesto").text = secuencia
        ET.SubElement(curtemp, "finalizarsecuenciacompuesto").text = "false"
        ET.SubElement(curtemp, "heredarmonitormodificadores").text = "false"
        ET.SubElement(curtemp, "comisionvendedor").text = "0.00"
        ET.SubElement(curtemp, "eliminarfiscal").text = "true"
        ET.SubElement(curtemp, "enviarproduccionsimodificador").text = "false"
        ET.SubElement(curtemp, "politicapuntos").text = "1"
        ET.SubElement(curtemp, "afectacomensales").text = "false"
        ET.SubElement(curtemp, "comensalesafectados").text = "1"
        ET.SubElement(curtemp, "idareadeimpresion").text = "2"
        ET.SubElement(curtemp, "cargoadicional").text = "0.00"
        ET.SubElement(curtemp, "favorito").text = "false"
        desc_menu = prod["descripcion"][:254] if prod["descripcion"] else ""
        ET.SubElement(curtemp, "descripcionmenuelectronico").text = desc_menu
        ET.SubElement(curtemp, "usarcomedor").text = "true"
        ET.SubElement(curtemp, "usardomicilio").text = "true"
        ET.SubElement(curtemp, "usarrapido").text = "true"
        ET.SubElement(curtemp, "usarmenuelectronico").text = "true"
        ET.SubElement(curtemp, "usarmultiplicadorprodcomp").text = "false"
        ET.SubElement(curtemp, "permitirprodcompenmodif").text = "true"
        ET.SubElement(curtemp, "redondeodecimales").text = "false"
        ET.SubElement(curtemp, "idunidad").text = "PZA"

    # Añadir declaración XML y esquema manualmente
    rough_string = ET.tostring(root, encoding='unicode')
    xml_str = '<?xml version = "1.0" encoding="Windows-1252" standalone="yes"?>\n'
    xml_str += '<VFPData>\n'
    
    # Esquema XSD (copiado del ejemplo)
    xsd_schema = '''\t<xsd:schema id="VFPData" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
\t\t<xsd:element name="VFPData" msdata:IsDataSet="true">
\t\t\t<xsd:complexType>
\t\t\t\t<xsd:choice maxOccurs="unbounded">
\t\t\t\t\t<xsd:element name="curtemp" minOccurs="0" maxOccurs="unbounded">
\t\t\t\t\t\t<xsd:complexType>
\t\t\t\t\t\t\t<xsd:sequence>
\t\t\t\t\t\t\t\t<xsd:element name="clave">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="15"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="descripcion">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="60"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="grupo">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="5"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="nombrecorto">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="20"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="precio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="iva">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="2"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="bloqueado" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="comentario">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="254"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="precioabierto">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="nofacturable" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="canjeablepuntos" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="preciopuntos">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="puntoscanje">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="puntosextras">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="plu">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="15"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="lunesinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="lunesfin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciolunes">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="lunesdiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="martesinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="martesfin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciomartes">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="martesdiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="miercolesinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="miercolesfin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciomiercoles">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="miercolesdiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="juevesinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="juevesfin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciojueves">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="juevesdiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="viernesinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="viernesfin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="precioviernes">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="viernesdiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="sabadoinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="sabadofin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciosabado">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="sabadodiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="domingoinicio">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="domingofin">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="11"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="preciodomingo">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="19"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="domingodiasalida">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="aplicalunes" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicamartes" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicamiercoles" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicajueves" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicaviernes" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicasabado" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="aplicadomingo" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="excentoimpuestos" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="secuenciacompuesto" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="finalizarsecuenciacompuesto" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="heredarmonitormodificadores" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="comisionvendedor">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="5"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="2"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="eliminarfiscal" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="enviarproduccionsimodificador" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="politicapuntos">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="1"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="afectacomensales" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="comensalesafectados">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="2"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="0"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="idareadeimpresion">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="4"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="cargoadicional">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:decimal">
\t\t\t\t\t\t\t\t\t\t\t<xsd:totalDigits value="4"/>
\t\t\t\t\t\t\t\t\t\t\t<xsd:fractionDigits value="2"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="favorito" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="descripcionmenuelectronico">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="254"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t<xsd:element name="usarcomedor" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="usardomicilio" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="usarrapido" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="usarmenuelectronico" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="usarmultiplicadorprodcomp" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="permitirprodcompenmodif" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="redondeodecimales" type="xsd:boolean"/>
\t\t\t\t\t\t\t\t<xsd:element name="idunidad">
\t\t\t\t\t\t\t\t\t<xsd:simpleType>
\t\t\t\t\t\t\t\t\t\t<xsd:restriction base="xsd:string">
\t\t\t\t\t\t\t\t\t\t\t<xsd:maxLength value="50"/>
\t\t\t\t\t\t\t\t\t\t</xsd:restriction>
\t\t\t\t\t\t\t\t\t</xsd:simpleType>
\t\t\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t\t\t\t</xsd:sequence>
\t\t\t\t\t\t\t</xsd:complexType>
\t\t\t\t\t\t</xsd:element>
\t\t\t\t\t</xsd:choice>
\t\t\t\t\t<xsd:anyAttribute namespace="http://www.w3.org/XML/1998/namespace" processContents="lax"/>
\t\t\t\t</xsd:complexType>
\t\t\t</xsd:element>
\t</xsd:schema>
'''

    xml_str += xsd_schema
    xml_str += rough_string.replace('<VFPData>', '').replace('</VFPData>', '').strip()
    xml_str += '\n</VFPData>'

    # Guardar
    with open(salida, 'w', encoding='cp1252') as f:
        f.write(xml_str)

    print(f"✅ Archivo XML generado: {salida}")

if __name__ == "__main__":
    productos = parsear_carta("carta.txt")
    print(f"📦 Productos encontrados: {len(productos)}")
    crear_xml(productos)