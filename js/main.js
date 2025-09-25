document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para la Galería y Lightbox (si está en la página) ---
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        // Duplicar elementos para el carrusel infinito
        const originalItems = galleryContainer.querySelectorAll('.gallery-item');
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            galleryContainer.appendChild(clone);
        });

        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const videoLightbox = document.getElementById('video-lightbox');
        const videoContainer = videoLightbox.querySelector('.video-container'); // Get the container
        const closeBtns = document.querySelectorAll('.lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        const imageItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => item.querySelector('img') && !item.hasAttribute('data-video-src'));
        let currentIndex;

        const showImage = (index) => {
            const numImages = imageItems.length / 2; // Usamos la mitad porque están duplicados
            const actualIndex = (index + numImages) % numImages;

            if (actualIndex < 0 || actualIndex >= numImages) return;

            currentIndex = actualIndex;
            lightboxImg.src = imageItems[currentIndex].querySelector('img').src;
            lightbox.style.display = 'block';
        };

        galleryItems.forEach(item => {
            item.style.cursor = 'pointer';
            if (item.hasAttribute('data-video-src')) {
                item.addEventListener('click', () => {
                    const videoSrc = item.getAttribute('data-video-src');
                    
                    // Limpiar contenedor
                    videoContainer.innerHTML = '';

                    // Crear video
                    const newVideo = document.createElement('video');
                    newVideo.setAttribute('src', videoSrc);
                    newVideo.setAttribute('controls', '');
                    newVideo.style.width = '100%'; // Asegurar que ocupe el contenedor

                    videoContainer.appendChild(newVideo);

                    videoLightbox.style.display = 'block';
                    
                    const playPromise = newVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Error al intentar reproducir el video:", error);
                        });
                    }
                });
            } else {
                item.addEventListener('click', () => {
                    const imageIndex = imageItems.indexOf(item);
                    showImage(imageIndex);
                });
            }
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            videoLightbox.style.display = 'none';
            // Limpiar el contenedor para detener el video y eliminar el elemento
            videoContainer.innerHTML = '';
        };

        const showNext = (e) => { e.preventDefault(); e.stopPropagation(); showImage(currentIndex + 1); };
        const showPrev = (e) => { e.preventDefault(); e.stopPropagation(); showImage(currentIndex - 1 + (imageItems.length / 2)); };

        closeBtns.forEach(btn => btn.addEventListener('click', closeLightbox));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        videoLightbox.addEventListener('click', (e) => { if (e.target === videoLightbox) closeLightbox(); });

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowRight') showNext(e);
                else if (e.key === 'ArrowLeft') showPrev(e);
                else if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    // --- Lógica para el botón "Volver Arriba" ---
    const backToTopBtn = document.createElement('a');
    backToTopBtn.setAttribute('id', 'back-to-top-btn');
    backToTopBtn.setAttribute('href', '#');
    backToTopBtn.classList.add('back-to-top-btn');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Lógica para Transición de Página ---
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Solo aplica a enlaces internos (no a redes sociales o anclas)
            if (href && (href.endsWith('.html')) && !this.getAttribute('target')) {
                e.preventDefault(); // Previene la navegación inmediata
                document.body.classList.add('fade-out');

                // Espera a que termine la animación para cambiar de página
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Debe coincidir con la duración de la animación
            }
        });
    });
});