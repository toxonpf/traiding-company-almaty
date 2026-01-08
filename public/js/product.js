function formatPrice(value, currencySymbol) {
    if (value === null || value === undefined || value === '') {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    const formatted = new Intl.NumberFormat('ru-RU').format(value);
    return currencySymbol ? `${formatted} ${currencySymbol}` : `${formatted} ₸`;
}

function normalizeBadge(product) {
    const text = product.badge_text || product.badge || product.label || '';
    if (!text) {
        return null;
    }
    const lower = String(text).toLowerCase();
    let type = product.badge_type || product.badgeType || '';
    if (!type) {
        if (lower.includes('new')) {
            type = 'new';
        } else if (lower.includes('%') || lower.includes('sale') || lower.includes('скид')) {
            type = 'sale';
        }
    }
    return { text, type };
}

function safeText(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    return String(value);
}

function buildSpecItem(label, value) {
    return `
        <div class="productSpecItem">
            <span class="productSpecLabel">${label}</span>
            <span class="productSpecValue">${value}</span>
        </div>
    `;
}

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    const text = await response.text();
    return { error: text || 'Unexpected response format' };
}

function getCategoryName(product) {
    return product.category || product.category_name || (product.categories && product.categories.name) || '';
}

let currentProduct = null;

function renderBreadcrumbs(category, title) {
    const breadcrumbsEl = document.getElementById('productBreadcrumbs');
    if (!breadcrumbsEl) {
        return;
    }
    const catalogLabel = breadcrumbsEl.getAttribute('data-catalog-label') || 'Каталог';
    const parts = [
        `<a href="catalog.html" class="productBreadcrumbLink">${safeText(catalogLabel)}</a>`,
        category ? `<span>${safeText(category)}</span>` : '',
        title ? `<span>${safeText(title)}</span>` : ''
    ].filter(Boolean);
    breadcrumbsEl.innerHTML = parts.join('<span class="productBreadcrumbSep">›</span>');
}

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || params.get('sku');
    const titleEl = document.getElementById('productTitle');
    const categoryEl = document.getElementById('productCategory');
    const imageEl = document.getElementById('productImage');
    const priceEl = document.getElementById('productPrice');
    const oldPriceEl = document.getElementById('productOldPrice');
    const descEl = document.getElementById('productDescription');
    const badgeEl = document.getElementById('productBadges');
    const metaEl = document.getElementById('productMeta');
    const specEl = document.getElementById('productSpecList');
    const breadcrumbsEl = document.getElementById('productBreadcrumbs');

    if (!productId) {
        if (titleEl) {
            titleEl.textContent = 'Товар не найден';
        }
        return;
    }

    try {
        const response = await fetch(`/api/products/${encodeURIComponent(productId)}`);
        const payload = await parseResponse(response);
        if (!response.ok) {
            throw new Error(payload.error || 'Не удалось загрузить товар');
        }

        const item = payload.item || {};
        const title = item.title || item.name || 'Без названия';
        const category = getCategoryName(item);
        const image = item.image_url || item.image || item.photo_url || 'https://placehold.co/600x600/4cb5b5/ffffff.png?text=Product';
        const latestPrice = Array.isArray(item.prices) && item.prices.length
            ? [...item.prices].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))[0]
            : null;
        const currency = (latestPrice && latestPrice.currency) || item.currency_symbol || item.currency || '';
        const price = formatPrice(latestPrice && latestPrice.price, currency);
        const oldPrice = formatPrice(item.old_price || item.oldPrice, currency);
        const description = item.description || item.details || item.notes || '';
        const sku = item.sku || item.article || item.code;
        const stock = item.stock || item.quantity || item.qty || item.min_stock;
        const unit = item.unit;
        const status = item.status;
        const rating = item.rating;
        const badge = normalizeBadge(item);

        if (titleEl) {
            titleEl.textContent = title;
        }
        if (categoryEl) {
            categoryEl.textContent = safeText(category);
        }
        currentProduct = { title, category };
        renderBreadcrumbs(category, title);
        if (imageEl) {
            imageEl.src = image;
            imageEl.alt = title;
        }
        if (priceEl) {
            priceEl.textContent = price || priceEl.getAttribute('data-empty') || '-';
        }
        if (oldPriceEl) {
            oldPriceEl.textContent = oldPrice || '';
            oldPriceEl.hidden = !oldPrice;
        }
        if (descEl) {
            descEl.textContent = description || '-';
        }
        if (badgeEl) {
            badgeEl.innerHTML = badge ? `<span class="badge ${badge.type || ''}">${badge.text}</span>` : '';
        }

        const metaParts = [];
        if (sku) {
            metaParts.push(`<span>SKU: ${safeText(sku)}</span>`);
        }
        if (rating !== undefined && rating !== null && rating !== '') {
            metaParts.push(`<span>Рейтинг: ${safeText(rating)}</span>`);
        }
        if (stock !== undefined && stock !== null && stock !== '') {
            metaParts.push(`<span>Остаток: ${safeText(stock)}</span>`);
        }
        if (unit) {
            metaParts.push(`<span>Ед: ${safeText(unit)}</span>`);
        }
        if (status) {
            metaParts.push(`<span>Статус: ${safeText(status)}</span>`);
        }
        if (metaEl) {
            metaEl.innerHTML = metaParts.join('');
        }

        if (specEl) {
            const specs = [];
            specs.push(buildSpecItem('Категория', safeText(category)));
            specs.push(buildSpecItem('Цена', price || (priceEl && priceEl.getAttribute('data-empty')) || '-'));
            if (sku) {
                specs.push(buildSpecItem('Артикул', safeText(sku)));
            }
            if (stock !== undefined && stock !== null && stock !== '') {
                specs.push(buildSpecItem('Остаток', safeText(stock)));
            }
            if (unit) {
                specs.push(buildSpecItem('Ед. измерения', safeText(unit)));
            }
            if (status) {
                specs.push(buildSpecItem('Статус', safeText(status)));
            }
            if (item.manufacturer) {
                specs.push(buildSpecItem('Производитель', safeText(item.manufacturer)));
            }
            if (item.country) {
                specs.push(buildSpecItem('Страна', safeText(item.country)));
            }
            if (item.weight) {
                specs.push(buildSpecItem('Вес', safeText(item.weight)));
            }
            if (item.volume) {
                specs.push(buildSpecItem('Объем', safeText(item.volume)));
            }
            specEl.innerHTML = specs.join('');
        }
    } catch (err) {
        if (titleEl) {
            titleEl.textContent = 'Товар не найден';
        }
        if (descEl) {
            descEl.textContent = err.message;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
});

document.addEventListener('languagechange', () => {
    if (currentProduct) {
        renderBreadcrumbs(currentProduct.category, currentProduct.title);
    }
});

