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

    // --- Inicializar Buscador (solo en página principal) ---
    if (document.getElementById('search-input')) {
        inicializarBuscador();
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