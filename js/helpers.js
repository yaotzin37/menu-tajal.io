function renderItems(items) {
    if (!items) return '';
    return items.map(item => `
        <div class="menu-item">
            <div class="item-header">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price}</span>
            </div>
            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
        </div>
    `).join('');
}

function initScrollToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}