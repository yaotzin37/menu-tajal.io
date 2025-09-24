const { JSDOM } = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM(`
  <!DOCTYPE html>
  <div class="gallery-container">
    <div class="gallery-item"><img src="image1.jpg"></div>
    <div class="gallery-item"><img src="image2.jpg"></div>
    <div class="gallery-item"><img src="image3.jpg"></div>
  </div>
  <div id="lightbox" style="display: none;">
    <img id="lightbox-img" src="">
  </div>
`);

// Expose the DOM globals
global.document = dom.window.document;

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

// Your gallery logic from main.js, adapted for testing
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

// Test Cases
test('Gallery should wrap from the first image to the last on "previous"', () => {
  setupGallery();

  // Start at the first image
  showImage(0);
  assert(currentIndex === 0, 'Should start at index 0');

  // Simulate clicking "previous"
  showImage(currentIndex - 1);

  // Check if it wrapped to the last image
  const numImages = imageItems.length / 2;
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