#!/usr/bin/env python3
"""
API Server para integración del menú TAJAL con sistemas POS
Proporciona endpoints para sincronización de menú, pedidos y inventario
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import sqlite3
import os
from datetime import datetime
import asyncio
import websockets
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar FastAPI
app = FastAPI(
    title="API Menú TAJAL - POS Integration",
    description="API para integración del menú con sistemas POS",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos
current_dir = os.path.dirname(os.path.abspath(__file__))
web_dir = os.path.join(current_dir, '..', 'web')
assets_dir = os.path.join(current_dir, '..', '..', 'assets')

# Servir archivos web
if os.path.exists(web_dir):
    app.mount("/src/web", StaticFiles(directory=web_dir), name="web")

# Servir assets (imágenes, CSS, etc.)
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# También servir archivos estáticos desde la raíz
app.mount("/static", StaticFiles(directory=web_dir), name="static")

# Modelos de datos
class MenuItem(BaseModel):
    id: str
    nombre: str
    descripcion: str
    precio: float
    categoria: str
    disponible: bool = True
    tiempo_preparacion: Optional[int] = None

class OrderItem(BaseModel):
    menu_item_id: str
    cantidad: int
    notas_especiales: Optional[str] = None

class Pedido(BaseModel):
    id_pedido: str
    items: List[OrderItem]
    total: float
    estado: str = "pendiente"
    timestamp: datetime = datetime.now()
    cliente_info: Optional[Dict] = None

class Categoria(BaseModel):
    id: str
    nombre: str
    descripcion: Optional[str] = None

# Conexión a base de datos
def get_db_connection():
    """Crear conexión a la base de datos SQLite"""
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'menu_pos.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Inicializar la base de datos con las tablas necesarias"""
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS menu_items (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            categoria TEXT NOT NULL,
            disponible BOOLEAN DEFAULT 1,
            tiempo_preparacion INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            orden INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id TEXT PRIMARY KEY,
            estado TEXT DEFAULT 'pendiente',
            total REAL NOT NULL,
            cliente_info TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS pedido_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id TEXT NOT NULL,
            menu_item_id TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            notas_especiales TEXT,
            FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
        )
    ''')

    conn.commit()
    conn.close()

# Funciones auxiliares
def load_menu_from_file():
    """Cargar menú desde carta.txt"""
    carta_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'carta.txt')
    if not os.path.exists(carta_path):
        return []

    with open(carta_path, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    menu_items = []
    current_category = None

    for line in lines:
        # Detectar categorías
        categorias = ["Desayunos", "Entradas", "Ensaladas", "Pastas", "Hamburguesas",
                     "Cortes", "Del Mar", "Infantil", "Postres", "Bebidas", "Extras"]

        if line in categorias or "Menú Infantil" in line:
            current_category = line
            continue

        # Si es un precio (contiene $)
        if '$' in line and any(char.isdigit() for char in line):
            continue

        # Si es un item del menú (texto descriptivo antes del precio)
        if current_category and line and not line.startswith('$'):
            # Crear item del menú básico
            item_id = f"{current_category.lower().replace(' ', '_')}_{len(menu_items)}"
            menu_item = MenuItem(
                id=item_id,
                nombre=line,
                descripcion=f"Delicioso platillo de la categoría {current_category}",
                precio=0.0,
                categoria=current_category,
                disponible=True
            )
            menu_items.append(menu_item)

    return menu_items

def sync_menu_to_db():
    """Sincronizar menú desde archivo a base de datos"""
    conn = get_db_connection()

    # Cargar categorías
    categorias_data = [
        ("desayunos", "Desayunos", "Deliciosos desayunos tradicionales", 1),
        ("entradas", "Entradas", "Aperitivos y entradas para compartir", 2),
        ("ensaladas", "Ensaladas", "Ensaladas frescas y saludables", 3),
        ("pastas", "Pastas", "Variedad de pastas italianas", 4),
        ("hamburguesas", "Hamburguesas", "Hamburguesas artesanales", 5),
        ("cortes", "Cortes", "Cortes de carne premium", 6),
        ("del_mar", "Del Mar", "Platillos del mar frescos", 7),
        ("infantil", "Infantil", "Menú especial para niños", 8),
        ("postres", "Postres", "Postres tradicionales y modernos", 9),
        ("bebidas", "Bebidas", "Refrescante selección de bebidas", 10),
        ("extras", "Extras", "Complementos adicionales", 11)
    ]

    conn.execute("DELETE FROM categorias")
    conn.executemany("INSERT INTO categorias (id, nombre, descripcion, orden) VALUES (?, ?, ?, ?)",
                     categorias_data)

    # Cargar items del menú
    menu_items = load_menu_from_file()

    # Guardar en base de datos (simplificado)
    for item in menu_items:
        conn.execute('''
            INSERT OR REPLACE INTO menu_items (id, nombre, descripcion, precio, categoria, disponible)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (item.id, item.nombre, item.descripcion, item.precio, item.categoria, item.disponible))

    conn.commit()
    conn.close()
    logger.info(f"Sincronizados {len(menu_items)} items del menú")

# API Endpoints
@app.get("/")
async def root():
    """Endpoint raíz"""
    return {"message": "API Menú TAJAL - POS Integration", "version": "1.0.0"}

@app.get("/menu", response_model=List[MenuItem])
async def get_menu():
    """Obtener todos los items del menú"""
    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM menu_items WHERE disponible = 1')
    items = []
    for row in cursor.fetchall():
        items.append(MenuItem(
            id=row['id'],
            nombre=row['nombre'],
            descripcion=row['descripcion'] or "",
            precio=row['precio'],
            categoria=row['categoria'],
            disponible=bool(row['disponible']),
            tiempo_preparacion=row['tiempo_preparacion']
        ))
    conn.close()
    return items

@app.get("/categorias", response_model=List[Categoria])
async def get_categories():
    """Obtener todas las categorías"""
    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM categorias ORDER BY orden')
    categorias = []
    for row in cursor.fetchall():
        categorias.append(Categoria(
            id=row['id'],
            nombre=row['nombre'],
            descripcion=row['descripcion']
        ))
    conn.close()
    return categorias

@app.get("/api/menu-data")
async def get_menu_for_digital_menu():
    """Obtener datos del menú formateados para el menú digital"""
    conn = get_db_connection()
    cursor = conn.execute('''
        SELECT id, nombre, descripcion, precio, categoria, disponible
        FROM menu_items
        WHERE disponible = 1
        ORDER BY categoria, nombre
    ''')

    items = []
    for row in cursor.fetchall():
        items.append({
            "id": row['id'],
            "nombre": row['nombre'],
            "descripcion": row['descripcion'] or "",
            "precio": float(row['precio']),
            "categoria": row['categoria'],
            "disponible": bool(row['disponible'])
        })

    conn.close()
    return items

@app.post("/sync-menu")
async def sync_menu_endpoint(background_tasks: BackgroundTasks):
    """Sincronizar menú desde archivo"""
    background_tasks.add_task(sync_menu_to_db)
    return {"message": "Sincronización iniciada"}

@app.post("/admin/add-item")
async def add_menu_item(item_data: dict):
    """Agregar nuevo item al menú (y opcionalmente al carta.txt)"""
    conn = get_db_connection()

    # Verificar que la categoría existe
    cursor = conn.execute('SELECT id FROM categorias WHERE nombre = ?', (item_data['categoria'],))
    category = cursor.fetchone()

    if not category:
        conn.close()
        raise HTTPException(status_code=400, detail="Categoría no válida")

    # Agregar item a la base de datos
    item_id = item_data['id']
    conn.execute('''
        INSERT INTO menu_items (id, nombre, descripcion, precio, categoria, disponible)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (item_id, item_data['nombre'], item_data['descripcion'],
          item_data['precio'], item_data['categoria'], item_data['disponible']))

    conn.commit()
    conn.close()

    return {"message": "Item agregado exitosamente", "id": item_id}

@app.put("/menu/item/{item_id}")
async def update_menu_item(item_id: str, item_data: dict):
    """Actualizar un item específico del menú"""
    conn = get_db_connection()

    # Verificar que el item existe
    cursor = conn.execute('SELECT * FROM menu_items WHERE id = ?', (item_id,))
    existing_item = cursor.fetchone()

    if not existing_item:
        conn.close()
        raise HTTPException(status_code=404, detail="Item no encontrado")

    # Actualizar item
    conn.execute('''
        UPDATE menu_items
        SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (item_data['nombre'], item_data['descripcion'], item_data['precio'],
          item_data['categoria'], item_id))

    conn.commit()
    conn.close()

    return {"message": "Item actualizado exitosamente", "id": item_id}

@app.delete("/menu/item/{item_id}")
async def delete_menu_item(item_id: str):
    """Eliminar un item del menú"""
    conn = get_db_connection()

    # Verificar que el item existe
    cursor = conn.execute('SELECT * FROM menu_items WHERE id = ?', (item_id,))
    existing_item = cursor.fetchone()

    if not existing_item:
        conn.close()
        raise HTTPException(status_code=404, detail="Item no encontrado")

    # Eliminar item
    conn.execute('DELETE FROM menu_items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()

    return {"message": "Item eliminado exitosamente", "id": item_id}

@app.put("/menu/item/{item_id}/toggle")
async def toggle_item_availability(item_id: str):
    """Cambiar disponibilidad de un item"""
    conn = get_db_connection()

    # Verificar que el item existe
    cursor = conn.execute('SELECT disponible FROM menu_items WHERE id = ?', (item_id,))
    existing_item = cursor.fetchone()

    if not existing_item:
        conn.close()
        raise HTTPException(status_code=404, detail="Item no encontrado")

    # Cambiar disponibilidad
    new_status = 0 if existing_item['disponible'] else 1
    conn.execute('UPDATE menu_items SET disponible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                (new_status, item_id))
    conn.commit()
    conn.close()

    return {"message": "Disponibilidad actualizada", "id": item_id, "disponible": bool(new_status)}

@app.post("/orders")
async def create_order(pedido: Pedido):
    """Crear un nuevo pedido desde el POS"""
    conn = get_db_connection()

    # Insertar pedido
    conn.execute('''
        INSERT INTO pedidos (id, estado, total, cliente_info)
        VALUES (?, ?, ?, ?)
    ''', (pedido.id_pedido, pedido.estado, pedido.total, json.dumps(pedido.cliente_info) if pedido.cliente_info else None))

    # Insertar items del pedido
    for item in pedido.items:
        conn.execute('''
            INSERT INTO pedido_items (pedido_id, menu_item_id, cantidad, notas_especiales)
            VALUES (?, ?, ?, ?)
        ''', (pedido.id_pedido, item.menu_item_id, item.cantidad, item.notas_especiales))

    conn.commit()
    conn.close()

    return {"message": "Pedido creado exitosamente", "id": pedido.id_pedido}

@app.get("/orders/{order_id}")
async def get_order(order_id: str):
    """Obtener detalles de un pedido"""
    conn = get_db_connection()
    cursor = conn.execute('''
        SELECT p.*, pi.menu_item_id, pi.cantidad, pi.notas_especiales,
               mi.nombre as item_nombre, mi.precio as item_precio
        FROM pedidos p
        LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
        LEFT JOIN menu_items mi ON pi.menu_item_id = mi.id
        WHERE p.id = ?
    ''', (order_id,))

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # Construir respuesta
    order_data = {
        "id": rows[0]['id'],
        "estado": rows[0]['estado'],
        "total": rows[0]['total'],
        "cliente_info": json.loads(rows[0]['cliente_info']) if rows[0]['cliente_info'] else None,
        "items": []
    }

    for row in rows:
        if row['menu_item_id']:  # Solo si hay items
            order_data["items"].append({
                "menu_item_id": row['menu_item_id'],
                "nombre": row['item_nombre'],
                "cantidad": row['cantidad'],
                "precio_unitario": row['item_precio'],
                "notas_especiales": row['notas_especiales']
            })

    return order_data

@app.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Actualizar estado de un pedido"""
    conn = get_db_connection()
    cursor = conn.execute('UPDATE pedidos SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                         (status, order_id))
    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    return {"message": "Estado actualizado", "pedido_id": order_id, "estado": status}

@app.get("/pos-integration")
async def pos_integration_info():
    """Información sobre integración POS"""
    return {
        "supported_formats": ["json", "xml", "csv"],
        "endpoints": {
            "menu_sync": "/menu",
            "create_order": "/orders (POST)",
            "get_order": "/orders/{id} (GET)",
            "update_status": "/orders/{id}/status (PUT)",
            "categories": "/categorias"
        },
        "real_time": {
            "websocket_url": "ws://localhost:8000/ws",
            "events": ["new_order", "order_status_updated", "menu_updated"]
        }
    }

# Inicialización
@app.on_event("startup")
async def startup_event():
    """Inicializar aplicación"""
    logger.info("Iniciando servidor API de menú TAJAL...")
    init_database()
    sync_menu_to_db()
    logger.info("Base de datos inicializada y menú sincronizado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
