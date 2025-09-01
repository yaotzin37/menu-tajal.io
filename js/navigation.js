function initNavigation(menuData) {
    const navigationContainer = document.getElementById('main-navigation');
    const menuContainer = document.getElementById('menu-content');

    if (!navigationContainer || !menuContainer || !menuData || !menuData.sections) {
        return;
    }

    // Generar los botones de navegación
    navigationContainer.innerHTML = menuData.sections.map((section, index) => {
        return `<button class="nav-btn ${index === 0 ? 'active' : ''}" data-section="${section.id}">${section.title}</button>`;
    }).join('');

    // Mostrar la primera sección por defecto
    const sections = menuContainer.querySelectorAll('.menu-section');
    if (sections.length > 0) {
        sections.forEach(s => s.classList.remove('active'));
        sections[0].classList.add('active');
    }

    // Añadir el event listener para los clicks en los botones
    navigationContainer.addEventListener('click', (event) => {
        if (event.target.matches('.nav-btn')) {
            const sectionId = event.target.getAttribute('data-section');
            showSection(sectionId);
        }
    });
}

function showSection(sectionId) {
    const menuSections = document.querySelectorAll('.menu-section');
    const navButtons = document.querySelectorAll('.nav-btn');

    // Ocultar todas las secciones y desactivar todos los botones
    menuSections.forEach(section => {
        section.classList.remove('active');
    });
    navButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar la sección y activar el botón correspondiente
    const sectionToShow = document.getElementById(sectionId);
    const buttonToActivate = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);

    if (sectionToShow) {
        sectionToShow.classList.add('active');
    }
    if (buttonToActivate) {
        buttonToActivate.classList.add('active');
    }
}
