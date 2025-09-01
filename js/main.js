// Punto de entrada principal de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData();
});

// Cargar datos del menú desde un archivo JSON externo
async function loadMenuData() {
    try {
        const response = await fetch('data/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuData = await response.json();
        renderMenu(menuData);
        // Después de renderizar, inicializar los componentes que dependen del contenido
        initNavigation(menuData);
        initSearch(menuData);
        initScrollToTop();

    } catch (error) {
        console.error('Error loading menu data:', error);
        const menuContainer = document.getElementById('menu-content');
        if(menuContainer) {
            menuContainer.innerHTML = '<p style="text-align: center; color: var(--color-secondary);">Error al cargar el menú. Por favor, intente de nuevo más tarde.</p>';
        }
    }
}

// Renderizar el menú completo en el DOM
function renderMenu(menuData) {
    const menuContainer = document.getElementById('menu-content');
    if (!menuContainer) return;

    let menuHTML = '';
    
    menuData.sections.forEach(section => {
        let sectionContent = '';
        // Manejar secciones con categorías anidadas (ej. Bebidas)
        if (section.categories) {
            sectionContent = section.categories.map(category => `
                <div class="menu-category">
                    <h3 class="category-title">${category.title}</h3>
                    ${renderItems(category.items)}
                </div>
            `).join('');
        } 
        // Manejar secciones con una lista simple de items
        else if (section.items) {
            sectionContent = `<div class="menu-category">${renderItems(section.items)}</div>`;
        }

        menuHTML += `
            <section id="${section.id}" class="menu-section">
                <h2 class="section-title">${section.title}</h2>
                <div class="menu-grid">
                    ${sectionContent}
                </div>
                ${section.footer ? `<p style="text-align:center; margin-top: 20px; font-style: italic; color: var(--color-text-light);">${section.footer}</p>` : ''}
            </section>
        `;
    });
    
    menuContainer.innerHTML = menuHTML;
}




