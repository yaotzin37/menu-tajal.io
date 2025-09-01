function renderItems(items) {
    if (!items) return '';
    return items.map(item => `
        <div class="menu-item">
            <div class="item-header">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">${item.price ? `$${item.price}` : ''}</p>
            </div>
            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
        </div>
    `).join('');
}

function initScrollToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
