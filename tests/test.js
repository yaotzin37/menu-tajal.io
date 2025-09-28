const { JSDOM } = require('jsdom');

// HTML structure that mirrors index.html's gallery
const html = `
  <!DOCTYPE html>
  <html>
    <body>
      <div class="gallery-container">
        <!-- Original Items -->
        <div class="gallery-item" data-video-src="assets/video/Video.mp4">
          <img src="placeholder.png" alt="Video">
        </div>
        <div class="gallery-item"><img src="assets/galeria-platillos/cortes/rib_eye.jpeg" alt="Rib-eye"></div>
        <div class="gallery-item"><img src="assets/galeria-platillos/cocteles/coctel-1.jpg" alt="Coctel"></div>
        <div class="gallery-item"><img src="assets/galeria-platillos/ambiente/ambiente-1.jpg" alt="Ambiente"></div>
        <div class="gallery-item"><img src="assets/galeria-platillos/cortes/tomahawk.jpg" alt="Tomahawk"></div>
      </div>
      <div id="lightbox" style="display: none;">
        <img id="lightbox-img" src="">
      </div>
    </body>
  </html>
`;

// Create a JSDOM instance
const dom = new JSDOM(html);

// Expose the DOM globals for the testing environment
global.document = dom.window.document;
global.window = dom.window;

// Simple assertion function for testing
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Function to run a test
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error);
    process.exit(1);
  }
}

// --- Gallery Logic (copied from main.js for testing) ---
// This logic should ideally be imported, but for now, we keep it here
// to test its behavior against the updated DOM structure.

let imageItems, currentIndex;

function setupGallery() {
  const galleryContainer = document.querySelector('.gallery-container');
  const originalItems = galleryContainer.querySelectorAll('.gallery-item');
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    galleryContainer.appendChild(clone);
  });
  imageItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => item.querySelector('img') && !item.hasAttribute('data-video-src'));
}

function showImage(index) {
  const numImages = imageItems.length / 2;
  const actualIndex = (index + numImages) % numImages;
  currentIndex = actualIndex;
  document.getElementById('lightbox-img').src = imageItems[currentIndex].querySelector('img').src;
  document.getElementById('lightbox').style.display = 'block';
}

// --- Test Cases ---

test('Gallery should initialize correctly and duplicate items', () => {
  setupGallery();
  const totalItems = document.querySelectorAll('.gallery-item').length;
  assert(totalItems === 10, `Expected 10 items after duplication, but found ${totalItems}`);
  assert(imageItems.length === 8, `Expected 8 image items (4 originals + 4 clones), but found ${imageItems.length}`);
});

test('Gallery should wrap from the first image to the last on "previous"', () => {
  setupGallery();

  // Start at the first image
  showImage(0);
  assert(currentIndex === 0, 'Should start at index 0');

  // Simulate clicking "previous"
  const numImages = imageItems.length / 2;
  showImage(currentIndex - 1);

  // Check if it wrapped to the last image
  assert(currentIndex === numImages - 1, `Expected to be at last image (index ${numImages - 1}), but was at ${currentIndex}`);
});

test('Gallery should wrap from the last image to the first on "next"', () => {
  setupGallery();

  // Start at the last image
  const numImages = imageItems.length / 2;
  showImage(numImages - 1);
  assert(currentIndex === numImages - 1, 'Should start at the last image');

  // Simulate clicking "next"
  showImage(currentIndex + 1);

  // Check if it wrapped to the first image
  assert(currentIndex === 0, `Expected to be at first image (index 0), but was at ${currentIndex}`);
});
