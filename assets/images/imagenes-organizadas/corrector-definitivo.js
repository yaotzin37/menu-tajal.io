const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);

class CorrectorDefinitivo {
    constructor() {
        this.correcciones = {
            'picaña': 'picaña'
        };
    }

    esUUID(nombre) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i;
        return uuidRegex.test(nombre);
    }

    normalizarNombre(nombre) {
        // NO modificar UUIDs
        if (this.esUUID(nombre)) {
            return nombre;
        }

        let nombreNormalizado = nombre;
        
        // Corregir tilde incorrecta
        nombreNormalizado = nombreNormalizado.replace(/picaña/g, 'picaña');
        
        // Corregir espacios (incluyendo dobles espacios)
        nombreNormalizado = nombreNormalizado.replace(/\s+/g, '_');
        
        // Corregir dobles guiones bajos
        nombreNormalizado = nombreNormalizado.replace(/_{2,}/g, '_');
        
        // Corregir paréntesis con números
        nombreNormalizado = nombreNormalizado.replace(/\((\d+)\)/g, '_$1');
        
        // Corregir guiones medios (excepto en t-bone)
        nombreNormalizado = nombreNormalizado.replace(/(?<!t)-/g, '_');
        
        return nombreNormalizado;
    }

    async corregirDefinitivamente(carpeta = './') {
        try {
            const archivos = await readdir(carpeta);
            const archivosWebP = archivos.filter(archivo => 
                archivo.toLowerCase().endsWith('.webp')
            );

            console.log(`📁 Encontrados ${archivosWebP.length} archivos WebP\n`);

            const cambios = [];
            const uuidModificados = [];

            for (const archivo of archivosWebP) {
                const nombreCorregido = this.normalizarNombre(archivo);
                
                if (nombreCorregido !== archivo) {
                    const rutaDestino = path.join(carpeta, nombreCorregido);
                    
                    if (!fs.existsSync(rutaDestino)) {
                        if (this.esUUID(archivo)) {
                            uuidModificados.push(archivo);
                        } else {
                            cambios.push({
                                original: archivo,
                                corregido: nombreCorregido
                            });
                        }
                    }
                }
            }

            if (uuidModificados.length > 0) {
                console.log('⚠️  UUIDs MODIFICADOS (deberían restaurarse):');
                uuidModificados.forEach((uuid, index) => {
                    console.log(`${index + 1}. ${uuid}`);
                });
                console.log('');
            }

            if (cambios.length === 0) {
                console.log('✅ No hay más correcciones necesarias');
                return;
            }

            console.log('🔧 ÚLTIMAS CORRECCIONES:');
            cambios.forEach((cambio, index) => {
                console.log(`${index + 1}. ${cambio.original}`);
                console.log(`   → ${cambio.corregido}\n`);
            });

            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('¿Aplicar estas correcciones finales? (s/n): ', async (respuesta) => {
                if (respuesta.toLowerCase() === 's') {
                    console.log('\n🔄 Aplicando correcciones...');
                    
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
                    
                    console.log('\n🎉 ¡CORRECCIÓN DEFINITIVA COMPLETADA!');
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
    const corrector = new CorrectorDefinitivo();
    corrector.corregirDefinitivamente(carpeta);
}
