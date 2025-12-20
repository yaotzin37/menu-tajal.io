const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);

class CorrectorNombresSeguro {
    constructor() {
        this.correcciones = {
            // Solo correcciones de ortografía críticas
            'maracuñita': 'maracuyita',
            'picaña': 'picaña',
            'pelliscada': 'pellizcada',
            'sanria': 'sangria',
            'hamburgueza': 'hamburguesa',
            'cheescake': 'cheesecake'
        };
    }

    esUUID(nombre) {
        // Verificar si es un UUID (formato con guiones)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i;
        return uuidRegex.test(nombre);
    }

    normalizarNombre(nombre) {
        // No modificar UUIDs
        if (this.esUUID(nombre)) {
            return nombre;
        }

        let nombreNormalizado = nombre;
        
        // Aplicar solo correcciones de ortografía críticas
        Object.keys(this.correcciones).forEach(error => {
            const regex = new RegExp(error, 'gi');
            nombreNormalizado = nombreNormalizado.replace(regex, this.correcciones[error]);
        });
        
        // Solo corregir espacios problemáticos (no todos los guiones)
        nombreNormalizado = nombreNormalizado.replace(/\s+/g, '_');
        
        // Solo corregir paréntesis con números
        nombreNormalizado = nombreNormalizado.replace(/\((\d+)\)/g, '_$1');
        
        // Eliminar guión bajo extra al final
        nombreNormalizado = nombreNormalizado.replace(/_\.webp$/, '.webp');
        
        return nombreNormalizado;
    }

    async corregirArchivosEnCarpeta(carpeta = './') {
        try {
            const archivos = await readdir(carpeta);
            const archivosWebP = archivos.filter(archivo => 
                archivo.toLowerCase().endsWith('.webp')
            );

            console.log(`📁 Encontrados ${archivosWebP.length} archivos WebP\n`);

            const cambiosSeguros = [];
            const cambiosPeligrosos = [];
            const sinCambios = [];

            for (const archivo of archivosWebP) {
                const nombreCorregido = this.normalizarNombre(archivo);
                
                if (nombreCorregido !== archivo) {
                    const rutaDestino = path.join(carpeta, nombreCorregido);
                    
                    if (fs.existsSync(rutaDestino)) {
                        cambiosPeligrosos.push({
                            original: archivo,
                            corregido: nombreCorregido,
                            motivo: 'CONFLICTO: El archivo destino ya existe'
                        });
                    } else if (this.esUUID(archivo)) {
                        cambiosPeligrosos.push({
                            original: archivo,
                            corregido: nombreCorregido,
                            motivo: 'PELIGROSO: Es un UUID, no modificar'
                        });
                    } else {
                        cambiosSeguros.push({
                            original: archivo,
                            corregido: nombreCorregido
                        });
                    }
                } else {
                    sinCambios.push(archivo);
                }
            }

            // Mostrar cambios SEGUROS
            if (cambiosSeguros.length > 0) {
                console.log('✅ CAMBIOS SEGUROS (recomendados):');
                cambiosSeguros.forEach((cambio, index) => {
                    console.log(`${index + 1}. ${cambio.original}`);
                    console.log(`   → ${cambio.corregido}\n`);
                });
            } else {
                console.log('ℹ️  No hay cambios seguros para aplicar');
            }

            // Mostrar cambios PELIGROSOS
            if (cambiosPeligrosos.length > 0) {
                console.log('🚫 CAMBIOS PELIGROSOS (NO aplicar):');
                cambiosPeligrosos.forEach((cambio, index) => {
                    console.log(`${index + 1}. ${cambio.original}`);
                    console.log(`   → ${cambio.corregido}`);
                    console.log(`   ⚠️  ${cambio.motivo}\n`);
                });
            }

            if (cambiosSeguros.length === 0) {
                return;
            }

            // Preguntar confirmación solo para cambios seguros
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('¿Aplicar solo los cambios SEGUROS? (s/n): ', async (respuesta) => {
                if (respuesta.toLowerCase() === 's') {
                    console.log('\n🔄 Aplicando cambios seguros...');
                    
                    for (const cambio of cambiosSeguros) {
                        try {
                            const rutaVieja = path.join(carpeta, cambio.original);
                            const rutaNueva = path.join(carpeta, cambio.corregido);
                            
                            await rename(rutaVieja, rutaNueva);
                            console.log(`✅ ${cambio.original} → ${cambio.corregido}`);
                        } catch (error) {
                            console.error(`❌ Error renombrando ${cambio.original}:`, error.message);
                        }
                    }
                    
                    console.log('\n🎉 Corrección segura completada!');
                } else {
                    console.log('❌ Cambios cancelados');
                }
                
                readline.close();
            });

        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }
}

// Uso del script
if (require.main === module) {
    const carpeta = process.argv[2] || './';
    const corrector = new CorrectorNombresSeguro();
    corrector.corregirArchivosEnCarpeta(carpeta);
}

module.exports = CorrectorNombresSeguro;
