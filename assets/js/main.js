document.addEventListener('DOMContentLoaded', function() {
    // Cargar video correcto según tamaño de pantalla
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        const isMobile = window.innerWidth <= 768;
        const videoSrc = isMobile
            ? 'assets/video/mobile_hero_menu.mp4'
            : 'assets/video/escritorio_hero_menu.mp4';

        heroVideo.src = videoSrc;
        heroVideo.load(); // Forzar recarga del video

        // Actualizar video si cambia el tamaño de ventana
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const nowMobile = window.innerWidth <= 768;
                const currentSrc = heroVideo.src.includes('mobile_hero_menu.mp4');

                if ((nowMobile && !currentSrc) || (!nowMobile && currentSrc)) {
                    const newSrc = nowMobile
                        ? 'assets/video/mobile_hero_menu.mp4'
                        : 'assets/video/escritorio_hero_menu.mp4';
                    heroVideo.src = newSrc;
                    heroVideo.load();
                }
            }, 250);
        });
    }
    // --- Shared Functionality ---

    // Fix for iOS autoplay without validation warnings
    document.querySelectorAll('video').forEach(video => {
        video.setAttribute('playsinline', '');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
                this.setAttribute('aria-label', 'Activar modo claro');
            } else {
                icon.className = 'fas fa-moon';
                this.setAttribute('aria-label', 'Activar modo oscuro');
            }
        });
    }

    // --- Index Page Specifics ---

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    if (header) {
        let lastScrollTop = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (e.clientY < 100) {
                header.classList.remove('hidden');
            }
        });
    }

    // Gallery Carousel
    const carousel = document.querySelector('.gallery-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (prevBtn && nextBtn && carousel) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
    
    // Search Filters (Index)
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Scroll Indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('.search-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }

    // --- Menu Pages Specifics ---

    // Category Filter
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        const categories = document.querySelectorAll('.category');
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            categories.forEach(category => {
                if (selectedCategory === '' || category.id === selectedCategory) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
            
            if (selectedCategory) {
                const targetCategory = document.getElementById(selectedCategory);
                if (targetCategory) {
                    window.scrollTo({
                        top: targetCategory.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Search Functionality (Menu Pages)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(term) || desc.includes(term)) {
                    card.style.display = 'block';
                    if (card.classList.contains('visible')) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});

// Lightbox Functionality (Self-contained)
(function(){
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');

    function openLightbox(src){
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox(){
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    function wireLightboxEvents(){
        if (!lightbox) return;
        var closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });
        
        // Clicks en imágenes dentro de #galeria (Index)
        var galeriaEl = document.getElementById('galeria');
        if (galeriaEl) {
            galeriaEl.addEventListener('click', function(e){
                var t = e.target;
                // Handle clicks on the image or the overlay wrapper
                if (t.tagName === 'IMG' && t.closest('.gallery-item')) {
                     e.preventDefault();
                     openLightbox(t.currentSrc || t.src);
                } else if (t.closest('.gallery-item')) {
                     // If clicked on overlay, find the image
                     var img = t.closest('.gallery-item').querySelector('img');
                     if (img) {
                         e.preventDefault();
                         openLightbox(img.currentSrc || img.src);
                     }
                }
            });
        }
    }

    function openGalleryFromHash(){
        var hash = window.location.hash || '';
        var galeriaEl = document.getElementById('galeria');
        if (!galeriaEl) return;

        if (hash === '#galeria') {
            galeriaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        var prefix = '#galeria-src=';
        if (hash.startsWith(prefix)) {
            var src = decodeURIComponent(hash.slice(prefix.length));
            galeriaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            var container = galeriaEl.querySelector('.container') || galeriaEl;
            var existing = container.querySelector('.gallery-dynamic');
            if (existing) existing.remove();
            var wrap = document.createElement('div');
            wrap.className = 'gallery-dynamic';
            var img = document.createElement('img');
            img.src = src;
            img.alt = 'Imagen de galería';
            img.style.maxWidth = '100%';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
            img.loading = 'lazy';
            wrap.appendChild(img);
            container.appendChild(wrap);
            openLightbox(src);
        }
    }
    
    window.addEventListener('DOMContentLoaded', function(){ 
        wireLightboxEvents(); 
        openGalleryFromHash(); 
    });
    window.addEventListener('hashchange', openGalleryFromHash);
    
    // Expose openLightbox globally if needed for onclick handlers in HTML
    window.openLightbox = openLightbox;
})();
