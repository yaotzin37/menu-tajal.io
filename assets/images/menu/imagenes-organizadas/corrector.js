const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);

class CorrectorNombres {
    constructor() {
        this.correcciones = {
            // Correcciones de ortografía
            'maracuñita': 'maracuyita',
            'picaña': 'picaña',
            'pelliscada': 'pellizcada',
            'sanria': 'sangria',
            'hamburgueza': 'hamburguesa',
            'cheescake': 'cheesecake',
            'colimmitas': 'colimitas',
            'negraa': 'negra',
            
            // Normalizar a minúsculas (excepto extensiones)
            'Aguachile': 'aguachile',
            'Al_': 'al_',
            'Arrabiata': 'arrabiata', 
            'Bizarra': 'bizarra',
            'Cesar': 'cesar',
            'Martel': 'martel',
            'Monte': 'monte',
            'Grey': 'grey',
            'Tanqueray': 'tanqueray',
            'Zacapa': 'zacapa'
        };
    }

    normalizarNombre(nombre) {
        let nombreNormalizado = nombre;
        
        // Convertir todo a minúsculas (excepto la extensión)
        const extension = path.extname(nombreNormalizado);
        const nombreSinExtension = nombreNormalizado.slice(0, -extension.length);
        nombreNormalizado = nombreSinExtension.toLowerCase() + extension;
        
        // Aplicar correcciones de ortografía
        Object.keys(this.correcciones).forEach(error => {
            const regex = new RegExp(error, 'gi');
            nombreNormalizado = nombreNormalizado.replace(regex, this.correcciones[error]);
        });
        
        // Reemplazar espacios por guiones bajos
        nombreNormalizado = nombreNormalizado.replace(/\s+/g, '_');
        
        // Reemplazar paréntesis con números por guiones bajos
        nombreNormalizado = nombreNormalizado.replace(/\((\d+)\)/g, '_$1');
        
        // Reemplazar guiones medios por guiones bajos (excepto en casos específicos)
        nombreNormalizado = nombreNormalizado.replace(/(?<!t)-/g, '_');
        
        // Eliminar espacios o guiones bajos al inicio
        nombreNormalizado = nombreNormalizado.replace(/^[_\s]+/, '');
        
        // Eliminar múltiples guiones bajos consecutivos
        nombreNormalizado = nombreNormalizado.replace(/_{2,}/g, '_');
        
        // Eliminar guión bajo antes de la extensión
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

            const cambios = [];
            const errores = [];

            for (const archivo of archivosWebP) {
                const nombreCorregido = this.normalizarNombre(archivo);
                
                if (nombreCorregido !== archivo) {
                    // Verificar si el archivo destino ya existe
                    const rutaDestino = path.join(carpeta, nombreCorregido);
                    if (fs.existsSync(rutaDestino)) {
                        errores.push({
                            original: archivo,
                            corregido: nombreCorregido,
                            error: 'El archivo destino ya existe'
                        });
                    } else {
                        cambios.push({
                            original: archivo,
                            corregido: nombreCorregido
                        });
                    }
                }
            }

            if (cambios.length === 0 && errores.length === 0) {
                console.log('✅ Todos los nombres ya están correctos!');
                return;
            }

            // Mostrar cambios propuestos
            if (cambios.length > 0) {
                console.log('📋 CAMBIOS PROPUESTOS:');
                cambios.forEach((cambio, index) => {
                    console.log(`${index + 1}. ${cambio.original}`);
                    console.log(`   → ${cambio.corregido}\n`);
                });
            }

            // Mostrar errores
            if (errores.length > 0) {
                console.log('⚠️  ERRORES (archivos destino ya existen):');
                errores.forEach((error, index) => {
                    console.log(`${index + 1}. ${error.original}`);
                    console.log(`   → ${error.corregido} (${error.error})\n`);
                });
            }

            // Preguntar confirmación solo si hay cambios posibles
            if (cambios.length > 0) {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                readline.question('¿Deseas aplicar los cambios? (s/n): ', async (respuesta) => {
                    if (respuesta.toLowerCase() === 's') {
                        console.log('\n🔄 Aplicando cambios...');
                        
                        for (const cambio of cambios) {
                            try {
                                const rutaVieja = path.join(carpeta, cambio.original);
                                const rutaNueva = path.join(carpeta, cambio.corregido);
                                
                                await rename(rutaVieja, rutaNueva);
                                console.log(`✅ ${cambio.original} → ${cambio.corregido}`);
                            } catch (error) {
                                console.error(`❌ Error renombrando ${cambio.original}:`, error.message);
                            }
                        }
                        
                        console.log('\n🎉 Corrección completada!');
                    } else {
                        console.log('❌ Cambios cancelados');
                    }
                    
                    readline.close();
                });
            } else {
                console.log('❌ No hay cambios posibles debido a conflictos de nombres');
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }
}

// Uso del script
if (require.main === module) {
    const carpeta = process.argv[2] || './';
    const corrector = new CorrectorNombres();
    corrector.corregirArchivosEnCarpeta(carpeta);
}

module.exports = CorrectorNombres;
                                    
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
                console.log('ℹ️  No hay cambios seguros para aplicar');
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
