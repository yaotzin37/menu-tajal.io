const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);

class CorrectorFinal {
    constructor() {
        this.correcciones = {
            'picaña': 'picaña'
        };
    }

    normalizarNombre(nombre) {
        let nombreNormalizado = nombre;
        
        // Corregir tilde incorrecta
        nombreNormalizado = nombreNormalizado.replace(/picaña/g, 'picaña');
        
        // Corregir dobles espacios
        nombreNormalizado = nombreNormalizado.replace(/\s+/g, '_');
        
        // Corregir dobles guiones bajos
        nombreNormalizado = nombreNormalizado.replace(/_{2,}/g, '_');
        
        // Corregir paréntesis con números
        nombreNormalizado = nombreNormalizado.replace(/\((\d+)\)/g, '_$1');
        
        // Corregir guiones medios (excepto en t-bone)
        nombreNormalizado = nombreNormalizado.replace(/(?<!t)-/g, '_');
        
        return nombreNormalizado;
    }

    async corregirProblemasRestantes(carpeta = './') {
        try {
            const archivos = await readdir(carpeta);
            const archivosWebP = archivos.filter(archivo => 
                archivo.toLowerCase().endsWith('.webp')
            );

            console.log(`📁 Encontrados ${archivosWebP.length} archivos WebP\n`);

            const cambios = [];

            for (const archivo of archivosWebP) {
                const nombreCorregido = this.normalizarNombre(archivo);
                
                if (nombreCorregido !== archivo) {
                    const rutaDestino = path.join(carpeta, nombreCorregido);
                    
                    if (!fs.existsSync(rutaDestino)) {
                        cambios.push({
                            original: archivo,
                            corregido: nombreCorregido
                        });
                    }
                }
            }

            if (cambios.length === 0) {
                console.log('✅ Todos los nombres están correctos!');
                return;
            }

            console.log('🔧 CORRECCIONES FINALES:');
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
                    
                    console.log('\n🎉 ¡Todos los nombres están ahora correctos!');
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
    const corrector = new CorrectorFinal();
    corrector.corregirProblemasRestantes(carpeta);
}
