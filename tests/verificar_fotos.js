const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🔍 Verificando el funcionamiento de las fotos en el sitio Tajal\n');

// Archivos HTML a verificar
const htmlFiles = [
  'menu-platillos.html',
  'menu-mixologia.html',
  'index.html'
];

const projectRoot = path.join(__dirname, '..');
const results = {
  total: 0,
  valid: 0,
  missing: 0,
  fallback: 0,
  missingFiles: []
};

// Función para verificar si un archivo existe
function checkFileExists(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  return fs.existsSync(fullPath);
}

// Función para verificar imágenes en un archivo HTML
function verifyImagesInHTML(htmlFile) {
  const htmlPath = path.join(projectRoot, htmlFile);
  
  if (!fs.existsSync(htmlPath)) {
    console.log(`❌ No se encontró el archivo: ${htmlFile}\n`);
    return;
  }

  console.log(`\n📄 Verificando: ${htmlFile}`);
  console.log('─'.repeat(60));

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Obtener todas las imágenes
  const images = document.querySelectorAll('img');
  console.log(`Total de imágenes encontradas: ${images.length}`);

  let fileValid = 0;
  let fileMissing = 0;
  let fileFallback = 0;

  images.forEach((img, index) => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    
    results.total++;

    if (src) {
      const isFallback = src.includes('logo-fallback');
      const exists = checkFileExists(src);

      if (isFallback) {
        fileFallback++;
        results.fallback++;
        console.log(`⚠️  [${index + 1}] FALLBACK: "${alt}" usa imagen genérica`);
      } else if (exists) {
        fileValid++;
        results.valid++;
      } else {
        fileMissing++;
        results.missing++;
        results.missingFiles.push({ file: htmlFile, src, alt });
        console.log(`❌ [${index + 1}] FALTA: "${alt}" -> ${src}`);
      }
    }
  });

  console.log(`\n📊 Resumen para ${htmlFile}:`);
  console.log(`   ✅ Válidas: ${fileValid}`);
  console.log(`   ❌ Faltantes: ${fileMissing}`);
  console.log(`   ⚠️  Fallback: ${fileFallback}`);
}

// Verificar cada archivo HTML
htmlFiles.forEach(file => verifyImagesInHTML(file));

// Resumen final
console.log('\n' + '═'.repeat(60));
console.log('📈 RESUMEN GENERAL');
console.log('═'.repeat(60));
console.log(`Total de imágenes analizadas: ${results.total}`);
console.log(`✅ Imágenes válidas: ${results.valid} (${((results.valid/results.total)*100).toFixed(1)}%)`);
console.log(`❌ Imágenes faltantes: ${results.missing} (${((results.missing/results.total)*100).toFixed(1)}%)`);
console.log(`⚠️  Imágenes con fallback: ${results.fallback} (${((results.fallback/results.total)*100).toFixed(1)}%)`);

if (results.missingFiles.length > 0) {
  console.log('\n🔴 ARCHIVOS DE IMAGEN FALTANTES:');
  console.log('─'.repeat(60));
  results.missingFiles.forEach(({ file, src, alt }) => {
    console.log(`   📄 ${file}`);
    console.log(`      "${alt}" -> ${src}\n`);
  });
}

// Verificar estructura de directorios de imágenes
console.log('\n' + '═'.repeat(60));
console.log('📁 ESTRUCTURA DE DIRECTORIOS DE IMÁGENES');
console.log('═'.repeat(60));

const imageDir = path.join(projectRoot, 'assets/images/menu/imagenes-organizadas');
if (fs.existsSync(imageDir)) {
  const files = fs.readdirSync(imageDir);
  const webpFiles = files.filter(f => f.endsWith('.webp'));
  const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  
  console.log(`📂 assets/images/menu/imagenes-organizadas/`);
  console.log(`   Total de archivos: ${files.length}`);
  console.log(`   Archivos .webp: ${webpFiles.length}`);
  console.log(`   Archivos .jpg/.jpeg: ${jpgFiles.length}`);
} else {
  console.log('❌ No se encontró el directorio de imágenes organizadas');
}

// Estado final
console.log('\n' + '═'.repeat(60));
if (results.missing === 0) {
  console.log('✅ TODAS LAS FOTOS FUNCIONAN CORRECTAMENTE');
} else {
  console.log('⚠️  SE ENCONTRARON PROBLEMAS CON LAS FOTOS');
  console.log(`   ${results.missing} imagen(es) faltante(s)`);
  if (results.fallback > 0) {
    console.log(`   ${results.fallback} imagen(es) usando fallback genérico`);
  }
}
console.log('═'.repeat(60));

// Salir con código de error si hay imágenes faltantes
process.exit(results.missing > 0 ? 1 : 0);
