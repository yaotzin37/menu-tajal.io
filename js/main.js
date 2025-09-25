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
        const lightboxVideo = document.getElementById('lightbox-video');
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
                    
                    // Limpiar fuentes anteriores
                    while (lightboxVideo.firstChild) {
                        lightboxVideo.removeChild(lightboxVideo.firstChild);
                    }

                    // Crear y añadir el nuevo elemento source
                    const source = document.createElement('source');
                    source.setAttribute('src', videoSrc);
                    source.setAttribute('type', 'video/mp4');
                    lightboxVideo.appendChild(source);

                    // Cargar el nuevo video y reproducir
                    lightboxVideo.load();
                    videoLightbox.style.display = 'block';
                    const playPromise = lightboxVideo.play();
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
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
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
    });.lightbox {
    display: none;
    position: fixed;
    z-index: 2000;
    padding-top: 60px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.95);
}
.lightbox-content {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 900px;
    animation: zoomIn 0.4s ease;
}
.lightbox-close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1; /* Color específico para alta visibilidad */
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
}
.lightbox-close:hover {
    color: #bbb; /* Color específico para alta visibilidad */
}
.lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
}
.lightbox-nav a {
    color: var(--color-text-primary);
    font-size: 3em;
    text-decoration: none;
    transition: 0.3s;
}
.lightbox-nav a:hover { color: #bbb; /* Color específico para alta visibilidad */ }
.lightbox .video-container {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 900px;
    animation: zoomIn 0.4s ease;
}
.lightbox .video-container video { width: 100%; }

/* --- Botón Volver Arriba --- */
.back-to-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: none;
    background-color: var(--color-accent);
    color: var(--color-background);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    z-index: 1000;
    transition: opacity 0.3s, transform 0.3s;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* --- Pie de Página --- */
.site-footer {
    background-color: var(--color-background-footer);
    color: var(--color-text-secondary);
    padding: 60px 20px;
    border-top: 2px solid var(--color-accent);
}
.footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    gap: 40px;
}
.footer-column {
    flex: 1;
    min-width: 250px;
}
.footer-column h4 {
    color: var(--color-accent);
    font-family: var(--font-display);
    font-size: 1.8em;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
    padding-bottom: 10px;
}
.footer-column p, .footer-links li {
    font-size: 0.95em;
    line-height: 1.8;
    color: var(--color-text-footer);
}
.footer-column p i {
    color: var(--color-accent);
    margin-right: 10px;
    width: 20px;
    text-align: center;
}
.footer-links {
    list-style: none;
    padding: 0;
}
.footer-links li a {
    color: var(--color-text-footer);
    text-decoration: none;
    transition: color 0.3s;
}
.footer-links li a:hover {
    color: var(--color-text-primary);
}
.social-links a {
    color: var(--color-accent);
    text-decoration: none;
    margin: 0 15px;
    font-size: 1.5em;
    transition: color 0.3s;
    display: inline-block;
}
.social-links a:first-child { margin-left: 0; }
.social-links a:hover {
    color: var(--color-text-primary);
}
.footer-bottom {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #222;
    font-size: 0.9em;
    color: var(--color-text-footer-bottom);
}

/* --- Animaciones --- */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Animación escalonada para los elementos de la lista de menú */
.menu-page li:nth-child(1) { animation-delay: 0.1s; }
.menu-page li:nth-child(2) { animation-delay: 0.2s; }
.menu-page li:nth-child(3) { animation-delay: 0.3s; }
.menu-page li:nth-child(4) { animation-delay: 0.4s; }
.menu-page li:nth-child(5) { animation-delay: 0.5s; }
.menu-page li:nth-child(6) { animation-delay: 0.6s; }
.menu-page li:nth-child(7) { animation-delay: 0.7s; }
.menu-page li:nth-child(8) { animation-delay: 0.8s; }
.menu-page li:nth-child(9) { animation-delay: 0.9s; }
.menu-page li:nth-child(10) { animation-delay: 1.0s; }
.menu-page li:nth-child(11) { animation-delay: 1.1s; }
.menu-page li:nth-child(12) { animation-delay: 1.2s; }
.menu-page li:nth-child(13) { animation-delay: 1.3s; }

@keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

@keyframes zoomIn { from {transform: scale(0.8)} to {transform: scale(1)} }

body.fade-out {
    animation: fadeOutPage 0.5s ease-in-out forwards;
}
@keyframes fadeInPage {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes fadeOutPage {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* --- Media Queries (Responsividad) --- */
@media (max-width: 768px) {
    .hero-video-desktop { display: none; }
    .hero-video-mobile { display: block; }
    .buttons { flex-direction: column; align-items: center; gap: 15px; }
    .photo-gallery { padding: 60px 15px; }
    .photo-gallery h2 { font-size: 2.8em; }

    body.menu-page { padding: 10px; }
    .menu-page .container { padding: 15px; border: none; background: none; }
    .menu-page h1 { font-size: 2.5em; }
    .menu-page h2 { font-size: 2.2em; }
    .menu-page li { flex-direction: column; align-items: flex-start; gap: 5px; }
    .menu-page .item-desc { margin-left: 0; }
    .menu-page .item-price { text-align: left; min-width: auto; }
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Elementos de la video lightbox
    const videoLightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const videoClose = document.querySelector('.video-close');
    
    // Elementos de navegación
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Galería items
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    // Función para abrir lightbox de imagen
    function openImageLightbox(index) {
        const imgSrc = galleryItems[index].querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        currentIndex = index;
    }

    // Función para abrir lightbox de video
    function openVideoLightbox() {
        const videoSrc = galleryItems[0].getAttribute('data-video-src');
        lightboxVideo.src = videoSrc;
        videoLightbox.classList.add('active');
        
        // Reproducir automáticamente
        lightboxVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }

    // Cerrar lightboxes
    function closeLightboxes() {
        lightbox.classList.remove('active');
        videoLightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }

    // Navegación
    function showNext() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        if (currentIndex === 0) {
            closeLightboxes();
            openVideoLightbox();
        } else {
            openImageLightbox(currentIndex);
        }
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        if (currentIndex === 0) {
            closeLightboxes();
            openVideoLightbox();
        } else {
            openImageLightbox(currentIndex);
        }
    }

    // Event listeners para los items de la galería
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (index === 0) {
                // Es el video
                openVideoLightbox();
            } else {
                // Es una imagen
                openImageLightbox(index);
            }
        });
    });

    // Event listeners para cerrar
    lightboxClose.addEventListener('click', closeLightboxes);
    videoClose.addEventListener('click', closeLightboxes);

    // Cerrar al hacer clic fuera del contenido
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxes();
        }
    });

    videoLightbox.addEventListener('click', function(e) {
        if (e.target === videoLightbox) {
            closeLightboxes();
        }
    });

    // Navegación con flechas
    lightboxNext.addEventListener('click', function(e) {
        e.preventDefault();
        showNext();
    });

    lightboxPrev.addEventListener('click', function(e) {
        e.preventDefault();
        showPrev();
    });

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active') || videoLightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightboxes();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        }
    });
});
</script
});