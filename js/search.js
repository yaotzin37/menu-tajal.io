function initSearch(menuData) {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (!searchInput || !searchButton) return;

    const performSearchWrapper = () => performSearch(menuData, searchInput.value);

    searchButton.addEventListener('click', performSearchWrapper);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearchWrapper();
        } else {
            // Live search
            performSearchWrapper();
        }
    });
}

function performSearch(menuData, searchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const menuContent = document.getElementById('menu-content');
    let searchResultsContainer = document.getElementById('search-results-container');

    // Crear el contenedor de resultados si no existe
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.id = 'search-results-container';
        menuContent.parentNode.insertBefore(searchResultsContainer, menuContent.nextSibling);
    }

    // Si no hay término de búsqueda, mostrar el menú principal y ocultar los resultados
    if (normalizedSearchTerm === '') {
        menuContent.style.display = '';
        searchResultsContainer.style.display = 'none';
        // Opcional: volver a la primera sección
        showSection(menuData.sections[0].id);
        return;
    }

    // Ocultar el menú principal y mostrar los resultados
    menuContent.style.display = 'none';
    searchResultsContainer.style.display = '';

    const foundItems = [];
    menuData.sections.forEach(section => {
        const processItems = (items) => {
            items.forEach(item => {
                const name = item.name ? item.name.toLowerCase() : '';
                const description = item.description ? item.description.toLowerCase() : '';
                if (name.includes(normalizedSearchTerm) || description.includes(normalizedSearchTerm)) {
                    foundItems.push(item);
                }
            });
        };

        if (section.items) {
            processItems(section.items);
        } else if (section.categories) {
            section.categories.forEach(cat => processItems(cat.items));
        }
    });

    // Renderizar los resultados
    if (foundItems.length > 0) {
        searchResultsContainer.innerHTML = `
            <section class="menu-section active">
                <h2 class="section-title">Resultados para "${searchTerm}"</h2>
                <div class="menu-grid">
                    <div class="menu-category">
                        ${renderItems(foundItems)}
                    </div>
                </div>
            </section>
        `;
    } else {
        searchResultsContainer.innerHTML = `
            <section class="menu-section active">
                <h2 class="section-title">Sin resultados</h2>
                <p style="text-align:center; padding: 20px; color: var(--color-text-light);">No se encontraron resultados para "${searchTerm}".</p>
            </section>
        `;
    }
}
