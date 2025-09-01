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
