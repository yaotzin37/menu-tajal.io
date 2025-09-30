document.addEventListener('DOMContentLoaded', () => {

    // --- Tema claro/oscuro con persistencia ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    const applyThemeIcon = () => {
        if (!themeToggleBtn) return;
        const isLight = document.body.classList.contains('light-mode');
        themeToggleBtn.innerHTML = `<i class="fas ${isLight ? 'fa-moon' : 'fa-sun'}"></i>`;
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Activar modo oscuro' : 'Activar modo claro');
    };
    applyThemeIcon();
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            applyThemeIcon();
        });
    }

    // --- Lógica para la Galería Aleatoria ---
    const galleryImage = document.getElementById('random-gallery-image');
    if (galleryImage) {
        const images = [
            "assets/galeria-platillos/pastas/pasta_especial_del_chef.jpeg",
            "assets/galeria-platillos/infantil/nuggets_de_pollo.jpeg",
            "assets/galeria-platillos/infantil/hamburguesa_infantil.jpeg",
            "assets/galeria-platillos/mariscos/tacos_gobernador.jpeg",
            "assets/galeria-platillos/mariscos/salmon_a_las_brasas.jpeg",
            "assets/galeria-platillos/mariscos/pulpo_estilo_tajal.jpeg",
            "assets/galeria-platillos/mariscos/camarones_tajal.jpeg",
            "assets/galeria-platillos/mariscos/camarones_empanizados.jpeg",
            "assets/galeria-platillos/mariscos/camarones_al_ajillo.jpeg",
            "assets/galeria-platillos/mariscos/aguachile_verde.jpeg",
            "assets/galeria-platillos/mariscos/camarones_a_la_matequilla.jpeg",
            "assets/galeria-platillos/mariscos/camarones_a_la_diabla.jpeg",
            "assets/galeria-platillos/hamburguesas/hamburguesa_tajal.jpg",
            "assets/galeria-platillos/hamburguesas/hamburgesa_tradicional.jpeg",
            "assets/galeria-platillos/entradas/tostadas_de_atun.jpeg",
            "assets/galeria-platillos/entradas/torre_tajal_de_atun.jpeg",
            "assets/galeria-platillos/entradas/papas_a_la_francesa.jpeg",
            "assets/galeria-platillos/entradas/tuetanos_tajal.jpg",
            "assets/galeria-platillos/entradas/papa_gratinada_con_arrachera.jpeg",
            "assets/galeria-platillos/entradas/panela_asada.jpeg",
            "assets/galeria-platillos/entradas/guacamole_con_picaña.jpeg",
            "assets/galeria-platillos/entradas/chistorra_asada.jpeg",
            "assets/galeria-platillos/entradas/cecina.jpeg",
            "assets/galeria-platillos/cortes/tomahawk.jpg",
            "assets/galeria-platillos/cortes/rib_eye.jpeg",
            "assets/galeria-platillos/desayunos/plato_de_fruta.jpeg",
            "assets/galeria-platillos/desayunos/molletes_salados.jpeg",
            "assets/galeria-platillos/desayunos/hot-cakes.jpeg",
            "assets/galeria-platillos/desayunos/desayunos_tajal.jpg",
            "assets/galeria-platillos/desayunos/chilaquiles.jpeg",
            "assets/galeria-platillos/cocteles/coctel-1.jpg",
            "assets/galeria-platillos/ambiente/ambiente-1.jpg",
            "assets/galeria-platillos/ensaladas/ensalada_texmex.jpeg"
        ];

        // Pre-carga de imágenes para evitar parpadeos
        const preloaded = [];
        images.forEach(src => { const img = new Image(); img.src = src; preloaded.push(img); });

        let currentIndex = 0;

        const altFromPath = (path) => {
            const file = path.split('/').pop() || '';
            const name = file.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
            return name;
        };

        function showRandomImage() {
            // Fade out
            galleryImage.style.opacity = 0;

            setTimeout(() => {
                // Change image
                const randomIndex = Math.floor(Math.random() * images.length);
                currentIndex = randomIndex;
                const nextSrc = images[randomIndex];
                galleryImage.src = nextSrc;
                const desc = altFromPath(nextSrc);
                galleryImage.alt = desc;
                galleryImage.title = desc;
                galleryImage.setAttribute('aria-label', desc);
                
                // Fade in
                galleryImage.style.opacity = 1;
            }, 500); // Corresponds to the CSS transition duration
        }

        // Initial image
        showRandomImage();

        // Change image every 6 seconds (respeta preferencias de movimiento)
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
            setInterval(showRandomImage, 6000);
        }

        // --- Lightbox básico para la portada ---
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('#lightbox .lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        if (lightbox && lightboxImg && lightboxClose && prevBtn && nextBtn) {
            const openLightboxAt = (idx) => {
                currentIndex = (idx + images.length) % images.length;
                const src = images[currentIndex];
                lightboxImg.src = src;
                lightboxImg.alt = altFromPath(src);
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            };
            galleryImage.addEventListener('click', () => openLightboxAt(currentIndex));
            lightboxClose.addEventListener('click', () => { lightbox.style.display = 'none'; document.body.style.overflow = 'auto'; });
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { lightbox.style.display = 'none'; document.body.style.overflow = 'auto'; } });
            prevBtn.addEventListener('click', (e) => { e.preventDefault(); openLightboxAt(currentIndex - 1); });
            nextBtn.addEventListener('click', (e) => { e.preventDefault(); openLightboxAt(currentIndex + 1); });
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'block') {
                    if (e.key === 'Escape') { lightbox.style.display = 'none'; document.body.style.overflow = 'auto'; }
                    if (e.key === 'ArrowLeft') { openLightboxAt(currentIndex - 1); }
                    if (e.key === 'ArrowRight') { openLightboxAt(currentIndex + 1); }
                }
            });
        }
    }

    // --- Lógica para el botón "Volver Arriba" ---
    let backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('a');
        backToTopBtn.setAttribute('id', 'back-to-top-btn');
        backToTopBtn.setAttribute('href', '#');
        backToTopBtn.setAttribute('aria-label', 'Volver arriba');
        backToTopBtn.classList.add('back-to-top-btn');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    } else {
        // Asegurar clase y atributos mínimos
        backToTopBtn.classList.add('back-to-top-btn');
        backToTopBtn.setAttribute('href', '#');
        if (!backToTopBtn.getAttribute('aria-label')) backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    }

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

    // --- Lógica para Modal de Platillos ---
    const dishModal = document.getElementById('dish-modal');
    if (dishModal) {
        const dishModalClose = document.querySelector('.dish-modal-close');
        const dishModalImg = document.getElementById('dish-modal-img');
        const dishModalTitle = document.getElementById('dish-modal-title');
        const dishModalDesc = document.getElementById('dish-modal-desc');
        const dishModalPrice = document.getElementById('dish-modal-price');
        
        // Crear botón para alternar ajuste de imagen (contain/cover)
        const fitToggleBtn = document.createElement('button');
        fitToggleBtn.className = 'dish-modal-toggle';
        const setToggleLabel = () => {
            const isCover = dishModalImg.classList.contains('fit-cover');
            fitToggleBtn.innerHTML = `${isCover ? '<i class="fas fa-compress-arrows-alt"></i> Contener' : '<i class="fas fa-expand"></i> Cubrir'}`;
        };
        setToggleLabel();
        dishModal.appendChild(fitToggleBtn);
        fitToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dishModalImg.classList.toggle('fit-cover');
            setToggleLabel();
        });
        // Permitir alternar tocando la imagen
        dishModalImg.addEventListener('click', (e) => {
            e.stopPropagation();
            dishModalImg.classList.toggle('fit-cover');
            setToggleLabel();
        });
        // Añadir event listeners a platillos con imágenes
        document.querySelectorAll('.has-image').forEach(dishItem => {
            dishItem.addEventListener('click', function() {
                // Obtener datos del platillo
                const imageSrc = this.getAttribute('data-image') + '?t=' + new Date().getTime();
                console.log('Loading image:', imageSrc); // Debugging line
                // Eliminar ícono de cámara y espacios sobrantes
                const dishName = this.querySelector('.item-name').textContent.replace(/\s*\u{f030}|\s*📷/u, '').trim();
                const dishDescription = this.querySelector('.item-desc').textContent;
                const dishPrice = this.querySelector('.item-price').textContent;
                
                // Llenar el modal con la información
                dishModalImg.src = imageSrc;
                dishModalImg.alt = dishName;
                dishModalTitle.textContent = dishName;
                dishModalDesc.textContent = dishDescription;
                dishModalPrice.textContent = dishPrice;
                // Establecer modo de ajuste a 'cover' por defecto
                
                setToggleLabel();
                
                // Mostrar el modal
                dishModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevenir scroll mientras está abierto
            });
        });
        
        // Cerrar modal al hacer clic en la X
        dishModalClose.addEventListener('click', function() {
            dishModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Cerrar modal al hacer clic fuera del contenido
        dishModal.addEventListener('click', function(e) {
            if (e.target === dishModal) {
                dishModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Cerrar modal con la tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dishModal.style.display === 'block') {
                dishModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Lógica para Transición de Página ---
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Sólo aplica a enlaces internos (no a redes sociales o anclas)
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