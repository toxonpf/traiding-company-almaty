function toggleLike(btn) {
    btn.classList.toggle('active');
    btn.style.transform = "scale(0.8)";
    setTimeout(() => {
        btn.style.transform = "";
    }, 150);
}

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

function buildStars(rating) {
    if (!rating && rating !== 0) {
        return '';
    }

    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;

    for (let i = 0; i < full; i += 1) {
        stars.push(`<svg class="icon iconStar" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.27 1.402-8.168L.132 9.211l8.2-1.193z" /></svg>`);
    }

    if (hasHalf) {
        stars.push(`<svg class="icon iconStarHalf" viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="halfStarClip"><rect x="0" y="0" width="12" height="24" /></clipPath></defs><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.27 1.402-8.168L.132 9.211l8.2-1.193z" clip-path="url(#halfStarClip)" /><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.27 1.402-8.168L.132 9.211l8.2-1.193z" fill="none" stroke="currentColor" stroke-width="1" /></svg>`);
    }

    const emptyCount = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyCount; i += 1) {
        stars.push(`<svg class="icon iconStarEmpty" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.27 1.402-8.168L.132 9.211l8.2-1.193z" /></svg>`);
    }

    return stars.join('');
}

function renderProductCard(product) {
    const title = product.title || product.name || 'Без названия';
    const category = product.category || product.category_name || (product.categories && product.categories.name) || '';
    const image = product.image_url || product.image || product.photo_url || 'https://placehold.co/400x400/4cb5b5/ffffff.png?text=Product';
    const rating = Number(product.rating);
    const reviews = product.reviews_count ?? product.reviews ?? '';
    const latestPrice = getLatestPrice(product);
    const currency = (latestPrice && latestPrice.currency) || product.currency_symbol || product.currency || '';
    const price = formatPrice(latestPrice && latestPrice.price, currency);
    const oldPrice = formatPrice(product.old_price || product.oldPrice, currency);
    const badge = normalizeBadge(product);

    const ratingHtml = Number.isFinite(rating)
        ? `<div class="rating"><span class="stars">${buildStars(rating)}</span><span class="reviews">(${reviews || 0})</span></div>`
        : '';

    const badgeHtml = badge
        ? `<div class="badges"><span class="badge ${badge.type || ''}">${badge.text}</span></div>`
        : '';

    const oldPriceHtml = oldPrice ? `<span class="oldPrice">${oldPrice}</span>` : '';

    const productId = product.sku || product.id || product.product_id || '';
    const cardInner = `
            <div class="cardImageWrapper">
                ${badgeHtml}
                <button class="wishlistBtn" onclick="toggleLike(this)">
                    <svg class="icon iconHeart" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21s-6.6-4.35-9.33-8.1C-0.06 9.74 1.2 5.3 4.86 4.2A5 5 0 0 1 12 6a5 5 0 0 1 7.14-1.8c3.66 1.1 4.92 5.54 2.19 8.7C18.6 16.65 12 21 12 21Z" />
                    </svg>
                </button>
                <img src="${image}" alt="Товар" class="cardImg">
            </div>
            <div class="cardContent">
                <span class="category">${category}</span>
                <h3 class="title">${title}</h3>
                ${ratingHtml}
                <div class="footer">
                    <div class="priceBox">
                        <span class="price">${price}</span>
                        ${oldPriceHtml}
                    </div>
                    <button class="addBtn" title="В корзину">
                        <svg class="icon iconBag" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 7v-.5A6 6 0 0 1 18 6.5V7h2a1 1 0 0 1 .99 1.141l-1.6 11A1 1 0 0 1 18.4 20H5.6a1 1 0 0 1-.99-.859l-1.6-11A1 1 0 0 1 4 7h2Zm2.5 0h7v-.5a3.5 3.5 0 1 0-7 0V7Z" />
                        </svg>
                    </button>
                </div>
            </div>
    `;

    if (productId !== '') {
        const paramKey = product.sku ? 'sku' : 'id';
        return `
            <a class="cardLink" href="product.html?${paramKey}=${encodeURIComponent(productId)}">
                <div class="card">
                    ${cardInner}
                </div>
            </a>
        `;
    }

    return `
        <div class="card">
            ${cardInner}
        </div>
    `;
}

function getCategoryName(product) {
    return product.category || product.category_name || (product.categories && product.categories.name) || 'Без категории';
}

function getLatestPrice(product) {
    if (!Array.isArray(product.prices) || !product.prices.length) {
        return null;
    }
    return [...product.prices].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))[0];
}

function normalizeQuery(value) {
    return String(value || '').trim().toLowerCase();
}

async function loadCatalog() {
    const grid = document.querySelector('#catalogGrid');
    const categorySelect = document.querySelector('#categorySelect');
    const searchInput = document.querySelector('#catalogSearch');
    const countValue = document.querySelector('#catalogCountValue');
    const emptyState = document.querySelector('#catalogEmpty');
    const priceMinInput = document.querySelector('#priceMin');
    const priceMaxInput = document.querySelector('#priceMax');
    const manufacturerFilter = document.querySelector('#manufacturerFilter');
    const countryFilter = document.querySelector('#countryFilter');
    const filtersReset = document.querySelector('#filtersReset');
    if (!grid) {
        return;
    }

    grid.textContent = 'Загрузка...';

    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const payload = await response.json();
        const items = Array.isArray(payload.items) ? payload.items : [];

        if (!items.length) {
            grid.textContent = 'Нет доступных товаров';
            if (countValue) {
                countValue.textContent = '0';
            }
            return;
        }

        let activeCategory = 'all';
        let searchValue = '';
        let priceMin = '';
        let priceMax = '';
        let manufacturer = '';
        let country = '';

        const uniqueCategories = Array.from(new Set(items.map(getCategoryName)))
            .filter(Boolean)
            .sort((a, b) => String(a).localeCompare(String(b), 'ru'));

        function renderCategories() {
            if (!categorySelect) {
                return;
            }
            const allLabel = categorySelect.getAttribute('data-all-label') || 'Все категории';
            const options = [
                { id: 'all', label: allLabel },
                ...uniqueCategories.map((name) => ({ id: name, label: name }))
            ];
            categorySelect.innerHTML = options
                .map((item) => `<option value="${item.id}">${item.label}</option>`)
                .join('');
            categorySelect.value = activeCategory;
        }

        function renderFilterOptions() {
            if (manufacturerFilter) {
                const values = Array.from(new Set(items.map((item) => item.manufacturer).filter(Boolean)));
                const anyLabel = manufacturerFilter.getAttribute('data-any-label') || 'Любой';
                const options = [
                    `<option value="">${anyLabel}</option>`,
                    ...values.map((value) => `<option value="${value}">${value}</option>`)
                ];
                manufacturerFilter.innerHTML = options.join('');
                manufacturerFilter.value = manufacturer;
            }
            if (countryFilter) {
                const values = Array.from(new Set(items.map((item) => item.country).filter(Boolean)));
                const anyLabel = countryFilter.getAttribute('data-any-label') || 'Любая';
                const options = [
                    `<option value="">${anyLabel}</option>`,
                    ...values.map((value) => `<option value="${value}">${value}</option>`)
                ];
                countryFilter.innerHTML = options.join('');
                countryFilter.value = country;
            }
        }

        function applyFilters() {
            const query = normalizeQuery(searchValue);
            const filtered = items.filter((product) => {
                const title = normalizeQuery(product.title || product.name);
                const category = normalizeQuery(getCategoryName(product));
                const productManufacturer = normalizeQuery(product.manufacturer);
                const productCountry = normalizeQuery(product.country);
                const latest = getLatestPrice(product);
                const price = latest && latest.price !== null && latest.price !== undefined ? Number(latest.price) : null;
                const minValue = priceMin === '' ? null : Number(priceMin);
                const maxValue = priceMax === '' ? null : Number(priceMax);
                const matchCategory = activeCategory === 'all' || normalizeQuery(activeCategory) === category;
                const matchQuery = !query || title.includes(query) || category.includes(query);
                const matchManufacturer = !manufacturer || productManufacturer === normalizeQuery(manufacturer);
                const matchCountry = !country || productCountry === normalizeQuery(country);
                const matchMin = minValue === null || (price !== null && price >= minValue);
                const matchMax = maxValue === null || (price !== null && price <= maxValue);
                return matchCategory && matchQuery && matchManufacturer && matchCountry && matchMin && matchMax;
            });

            if (countValue) {
                countValue.textContent = String(filtered.length);
            }

            if (!filtered.length) {
                grid.innerHTML = '';
                if (emptyState) {
                    emptyState.hidden = false;
                } else {
                    grid.textContent = 'Нет доступных товаров';
                }
                return;
            }

            if (emptyState) {
                emptyState.hidden = true;
            }
            grid.innerHTML = filtered.map(renderProductCard).join('');
        }

        renderCategories();
        renderFilterOptions();
        applyFilters();

        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                activeCategory = categorySelect.value || 'all';
                applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchValue = searchInput.value || '';
                applyFilters();
            });
        }

        if (priceMinInput) {
            priceMinInput.addEventListener('input', () => {
                priceMin = priceMinInput.value;
                applyFilters();
            });
        }

        if (priceMaxInput) {
            priceMaxInput.addEventListener('input', () => {
                priceMax = priceMaxInput.value;
                applyFilters();
            });
        }

        if (manufacturerFilter) {
            manufacturerFilter.addEventListener('change', () => {
                manufacturer = manufacturerFilter.value;
                applyFilters();
            });
        }

        if (countryFilter) {
            countryFilter.addEventListener('change', () => {
                country = countryFilter.value;
                applyFilters();
            });
        }

        if (filtersReset) {
            filtersReset.addEventListener('click', () => {
                priceMin = '';
                priceMax = '';
                manufacturer = '';
                country = '';
                if (priceMinInput) priceMinInput.value = '';
                if (priceMaxInput) priceMaxInput.value = '';
                if (manufacturerFilter) manufacturerFilter.value = '';
                if (countryFilter) countryFilter.value = '';
                applyFilters();
            });
        }

        document.addEventListener('languagechange', () => {
            renderCategories();
            renderFilterOptions();
            applyFilters();
        });
    } catch (err) {
        grid.textContent = 'Не удалось загрузить товары';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
});
