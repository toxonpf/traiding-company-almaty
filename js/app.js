const PRODUCTS = [
    {
        id: 1,
        name: "Авокадо Хасс",
        price: 1290,
        oldPrice: 1490,
        category: "fruits",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        weight: "1 шт",
    },
    {
        id: 2,
        name: "Молоко фермерское 3,2%",
        price: 620,
        category: "dairy",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        weight: "1 л",
    },
    {
        id: 3,
        name: "Багет ржаной",
        price: 390,
        category: "bakery",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        weight: "320 г",
    },
    {
        id: 4,
        name: "Стейк рибай мраморный",
        price: 5490,
        category: "meat",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        weight: "400 г",
    },
    {
        id: 5,
        name: "Яблоки Голден",
        price: 780,
        category: "fruits",
        image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        weight: "1 кг",
    },
    {
        id: 6,
        name: "Сыр творожный",
        price: 1890,
        category: "dairy",
        image: "https://images.unsplash.com/photo-1580915411960-96c9be9bc854?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        weight: "200 г",
    },
    {
        id: 7,
        name: "Круассан классический",
        price: 420,
        category: "bakery",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        weight: "120 г",
    },
    {
        id: 8,
        name: "Филе куриное охлаждённое",
        price: 2890,
        category: "meat",
        image: "https://images.unsplash.com/photo-1604908177571-7c3b7f02f280?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        weight: "900 г",
    },
];

const CATEGORIES = [
    { id: "all", name: "Все" },
    { id: "fruits", name: "Фрукты и овощи" },
    { id: "dairy", name: "Молочные продукты" },
    { id: "bakery", name: "Выпечка и сладости" },
    { id: "meat", name: "Мясо и птица" },
];

const state = {
    cart: [],
    activeCategory: "all",
};

const elements = {
    productsGrid: document.getElementById("products-grid"),
    categoriesContainer: document.getElementById("categories-container"),
    cartBadge: document.getElementById("cart-badge"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartOverlay: document.getElementById("cart-overlay"),
    cartItemsContainer: document.getElementById("cart-items-container"),
    cartCountTitle: document.getElementById("cart-count-title"),
    cartTotal: document.getElementById("cart-total"),
    cartFooter: document.getElementById("cart-footer"),
};

document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    renderProducts();
    initCartTriggers();
    initModal();
    initAnimations();
    lucide.createIcons();
});

function renderCategories() {
    elements.categoriesContainer.innerHTML = CATEGORIES.map((cat) => `
        <button class="category-chip ${state.activeCategory === cat.id ? "is-active" : ""}" data-category="${cat.id}">
            ${cat.name}
        </button>
    `).join("");
}

function renderProducts() {
    const filtered = state.activeCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === state.activeCategory);

    elements.productsGrid.innerHTML = filtered.map((product) => `
        <article class="product-card hero-anim-item">
            <div class="product-card__badges">
                ${product.oldPrice ? '<span class="badge badge-sale">SALE</span>' : ""}
            </div>
            <button class="product-fav" aria-label="Добавить в избранное">
                <i data-lucide="heart" width="16"></i>
            </button>
            <div class="product-card__visual">
                <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/320x240?text=TCA'">
            </div>
            <div class="product-card__meta">
                <span>${product.weight}</span>
                <span class="rating">
                    <i data-lucide="star" width="14" class="lucide-filled"></i>
                    ${product.rating}
                </span>
            </div>
            <h3 class="product-card__title">${product.name}</h3>
            <div class="product-card__price">
                <span class="price">${product.price} ₸</span>
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₸</span>` : ""}
            </div>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                <i data-lucide="plus" width="16"></i>
                В корзину
            </button>
        </article>
    `).join("");

    lucide.createIcons();
    gsap.fromTo(".product-card", { y: 30, opacity: 0, scale: 0.95 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.2)",
    });
}

function setCategory(id) {
    state.activeCategory = id;
    renderCategories();
    renderProducts();
}

function addToCart(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const existing = state.cart.find((item) => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(id, delta) {
    const item = state.cart.find((c) => c.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCartUI();
    }
}

function removeFromCart(id) {
    state.cart = state.cart.filter((item) => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (elements.cartBadge) {
        elements.cartBadge.textContent = totalCount;
        elements.cartBadge.classList.toggle("is-visible", totalCount > 0);
    }

    if (elements.cartCountTitle) {
        elements.cartCountTitle.textContent = `(${state.cart.length})`;
    }
    if (elements.cartTotal) {
        elements.cartTotal.textContent = `${totalPrice} ₸`;
    }

    if (state.cart.length === 0) {
        elements.cartItemsContainer.innerHTML = `
            <div class="cart-items-empty">
                <i data-lucide="shopping-cart" width="56"></i>
                <p>Корзина пуста</p>
                <small>Добавьте товары из каталога — доставка по Алматы в день заказа.</small>
            </div>
        `;
        elements.cartFooter.classList.add("hidden");
    } else {
        elements.cartItemsContainer.innerHTML = state.cart.map((item) => `
            <div class="cart-item">
                <div class="cart-thumb"><img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"></div>
                <div>
                    <h4>${item.name}</h4>
                    <div class="cart-meta">${item.weight}</div>
                    <div class="quantity">
                        <button data-action="decrease" data-id="${item.id}">
                            <i data-lucide="minus" width="12"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button data-action="increase" data-id="${item.id}">
                            <i data-lucide="plus" width="12"></i>
                        </button>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <span class="cart-price">${item.price} ₸</span>
                    <button class="remove-button" data-action="remove" data-id="${item.id}">
                        <i data-lucide="trash-2" width="16"></i>
                    </button>
                </div>
            </div>
        `).join("");
        elements.cartFooter.classList.remove("hidden");
    }

    lucide.createIcons();
}

function openCart() {
    updateCartUI();
    elements.cartOverlay.classList.add("is-visible");
    elements.cartDrawer.classList.add("is-open");
    document.body.classList.add("lock-scroll");

    if (state.cart.length > 0) {
        gsap.fromTo(".cart-item", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, delay: 0.1 });
    }
}

function closeCart() {
    elements.cartOverlay.classList.remove("is-visible");
    elements.cartDrawer.classList.remove("is-open");
    document.body.classList.remove("lock-scroll");
}

function initCartTriggers() {
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");

    cartBtn?.addEventListener("click", openCart);
    closeCartBtn?.addEventListener("click", closeCart);
    elements.cartOverlay?.addEventListener("click", closeCart);

    elements.categoriesContainer?.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-category]");
        if (!btn) return;
        setCategory(btn.dataset.category);
    });

    elements.productsGrid?.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart");
        if (!btn) return;
        addToCart(Number(btn.dataset.id));
    });

    elements.cartItemsContainer?.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-action]");
        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "increase") updateQuantity(id, 1);
        if (action === "decrease") updateQuantity(id, -1);
        if (action === "remove") removeFromCart(id);
    });
}

function initModal() {
    const modal = document.getElementById("myModal");
    const openBtn = document.getElementById("myBtn");
    const closeBtn = modal?.querySelector(".close");
    const form = modal?.querySelector("form");

    if (!modal || !openBtn || !closeBtn) return;

    const closeModal = () => modal.classList.remove("open");

    openBtn.addEventListener("click", () => modal.classList.add("open"));
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        // здесь могла бы быть отправка формы
        closeModal();
    });
}

function initAnimations() {
    gsap.to("#main-header", { y: 0, opacity: 1, duration: 1, ease: "power3.out" });

    gsap.to(".hero-anim", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
    });

    gsap.to(".hero-visual", {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
    });
}
