document.addEventListener('DOMContentLoaded', () => {

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

        let currentIndex = 0;

        function showRandomImage() {
            // Fade out
            galleryImage.style.opacity = 0;

            setTimeout(() => {
                // Change image
                const randomIndex = Math.floor(Math.random() * images.length);
                galleryImage.src = images[randomIndex];
                
                // Fade in
                galleryImage.style.opacity = 1;
            }, 500); // Corresponds to the CSS transition duration
        }

        // Initial image
        showRandomImage();

        // Change image every 2 seconds
        setInterval(showRandomImage, 2000);
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