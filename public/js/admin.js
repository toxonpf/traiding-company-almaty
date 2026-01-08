const tokenKey = 'sb_access_token';
const tableSelect = document.getElementById('tableSelect');
const limitInput = document.getElementById('limitInput');
const loadBtn = document.getElementById('loadBtn');
const dataList = document.getElementById('dataList');
const dataStatus = document.getElementById('dataStatus');
const createForm = document.getElementById('createForm');
const createJson = document.getElementById('createJson');
const createStatus = document.getElementById('createStatus');
const updateForm = document.getElementById('updateForm');
const updateId = document.getElementById('updateId');
const updateJson = document.getElementById('updateJson');
const updateStatus = document.getElementById('updateStatus');
const deleteForm = document.getElementById('deleteForm');
const deleteId = document.getElementById('deleteId');
const deleteStatus = document.getElementById('deleteStatus');
const uploadForm = document.getElementById('uploadForm');
const uploadProductId = document.getElementById('uploadProductId');
const uploadFile = document.getElementById('uploadFile');
const uploadStatus = document.getElementById('uploadStatus');
const createProductForm = document.getElementById('createProductForm');
const productName = document.getElementById('productName');
const productSku = document.getElementById('productSku');
const productCategory = document.getElementById('productCategory');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const productStock = document.getElementById('productStock');
const productImage = document.getElementById('productImage');
const createProductStatus = document.getElementById('createProductStatus');
const adminUser = document.getElementById('adminUser');
const logoutBtn = document.getElementById('logoutBtn');

function setStatus(target, text, isError) {
    if (!target) {
        return;
    }
    target.textContent = text;
    target.classList.toggle('isError', Boolean(isError));
}

function getToken() {
    return localStorage.getItem(tokenKey);
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatJson(value) {
    return JSON.stringify(value, null, 2);
}

function parseJsonInput(value) {
    if (!value) {
        return null;
    }
    return JSON.parse(value);
}

function generateSku(name) {
    if (!name) {
        return '';
    }
    const upper = String(name).trim().toUpperCase();
    const cleaned = upper.replace(/[^0-9A-ZА-ЯЁ]+/g, '-').replace(/^-+|-+$/g, '');
    return cleaned || 'ITEM';
}

async function loadCategories() {
    if (!productCategory) {
        return;
    }
    try {
        const response = await fetch('/api/admin/categories?limit=500', {
            headers: { ...authHeaders() }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки категорий');
        }
        const items = Array.isArray(data.items) ? data.items : [];
        const options = [
            '<option value="">Выберите категорию</option>',
            ...items
                .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
                .map((item) => `<option value="${item.id}">${item.name || item.id}</option>`)
        ];
        productCategory.innerHTML = options.join('');
    } catch (err) {
        setStatus(createProductStatus, err.message, true);
    }
}

async function createProductRecord(payload) {
    const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания товара');
    }
    return data.items && data.items[0] ? data.items[0] : null;
}

async function createPriceRecord(productId, priceValue) {
    const response = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
            product_id: productId,
            price: Number(priceValue),
            currency: 'KZT'
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания цены');
    }
    return data;
}
async function loadConfig() {
    const response = await fetch('/api/config');
    if (!response.ok) {
        throw new Error('Не удалось получить конфигурацию');
    }
    return response.json();
}

async function uploadImageToStorage(file, config) {
    const safeName = file.name.replace(/\s+/g, '-');
    const filePath = `${Date.now()}-${safeName}`;
    const uploadUrl = `${config.supabaseUrl}/storage/v1/object/products/${encodeURIComponent(filePath)}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.supabaseAnonKey}`,
            apikey: config.supabaseAnonKey,
            'Content-Type': file.type || 'application/octet-stream'
        },
        body: file
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Ошибка загрузки файла');
    }
    return `${config.supabaseUrl}/storage/v1/object/public/products/${filePath}`;
}

async function updateProductImage(productId, imageUrl) {
    const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ image_url: imageUrl })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Не удалось обновить товар');
    }
    return data;
}

async function requireAdmin() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        const response = await fetch('/api/auth/me', {
            headers: { ...authHeaders() }
        });
        const data = await response.json();
        if (!response.ok || !data.isAdmin) {
            throw new Error('Недостаточно прав');
        }
        adminUser.textContent = data.email ? `Вход: ${data.email}` : '';
        return true;
    } catch (err) {
        window.location.href = 'login.html';
        return false;
    }
}

function renderList(items) {
    if (!items.length) {
        dataList.innerHTML = '<p>Нет данных</p>';
        return;
    }

    const blocks = items.map((item) => {
        const id = item.id || '';
        return `
            <div class="adminRow">
                <div class="adminRowHeader">
                    <span class="adminRowId">${id}</span>
                    <div class="adminRowActions">
                        <button class="button small" data-edit-id="${id}">Редактировать</button>
                        <button class="button small danger" data-delete-id="${id}">Удалить</button>
                    </div>
                </div>
                <pre>${formatJson(item)}</pre>
            </div>
        `;
    }).join('');

    dataList.innerHTML = blocks;
}

async function loadData() {
    const table = tableSelect.value;
    const limit = limitInput.value || 100;
    setStatus(dataStatus, 'Загрузка...');
    try {
        const response = await fetch(`/api/admin/${table}?limit=${encodeURIComponent(limit)}`, {
            headers: { ...authHeaders() }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки');
        }
        renderList(Array.isArray(data.items) ? data.items : []);
        setStatus(dataStatus, `Загружено: ${data.items ? data.items.length : 0}`);
    } catch (err) {
        setStatus(dataStatus, err.message, true);
    }
}

async function createRecord(payload) {
    const table = tableSelect.value;
    setStatus(createStatus, 'Отправка...');
    try {
        const response = await fetch(`/api/admin/${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка создания');
        }
        setStatus(createStatus, 'Готово');
        createJson.value = '';
        await loadData();
    } catch (err) {
        setStatus(createStatus, err.message, true);
    }
}

async function updateRecord(id, payload) {
    const table = tableSelect.value;
    setStatus(updateStatus, 'Отправка...');
    try {
        const response = await fetch(`/api/admin/${table}/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка обновления');
        }
        setStatus(updateStatus, 'Готово');
        updateJson.value = '';
        updateId.value = '';
        await loadData();
    } catch (err) {
        setStatus(updateStatus, err.message, true);
    }
}

async function deleteRecord(id) {
    const table = tableSelect.value;
    setStatus(deleteStatus, 'Отправка...');
    try {
        const response = await fetch(`/api/admin/${table}/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { ...authHeaders() }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка удаления');
        }
        setStatus(deleteStatus, 'Готово');
        deleteId.value = '';
        await loadData();
    } catch (err) {
        setStatus(deleteStatus, err.message, true);
    }
}

if (loadBtn) {
    loadBtn.addEventListener('click', loadData);
}

if (createForm) {
    createForm.addEventListener('submit', (event) => {
        event.preventDefault();
        try {
            const payload = parseJsonInput(createJson.value);
            if (!payload) {
                setStatus(createStatus, 'Введите JSON', true);
                return;
            }
            createRecord(payload);
        } catch (err) {
            setStatus(createStatus, 'Неверный JSON', true);
        }
    });
}

if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        try {
            const payload = parseJsonInput(updateJson.value);
            if (!payload) {
                setStatus(updateStatus, 'Введите JSON', true);
                return;
            }
            updateRecord(updateId.value.trim(), payload);
        } catch (err) {
            setStatus(updateStatus, 'Неверный JSON', true);
        }
    });
}

if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = deleteId.value.trim();
        if (!id) {
            setStatus(deleteStatus, 'Введите id', true);
            return;
        }
        deleteRecord(id);
    });
}

if (dataList) {
    dataList.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const editId = target.getAttribute('data-edit-id');
        const deleteTargetId = target.getAttribute('data-delete-id');
        if (editId) {
            updateId.value = editId;
            updateJson.focus();
        }
        if (deleteTargetId) {
            deleteId.value = deleteTargetId;
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(tokenKey);
        window.location.href = 'login.html';
    });
}

if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const productId = uploadProductId ? uploadProductId.value.trim() : '';
        const file = uploadFile && uploadFile.files ? uploadFile.files[0] : null;
        if (!productId || !file) {
            setStatus(uploadStatus, 'Укажите id товара и файл', true);
            return;
        }
        try {
            setStatus(uploadStatus, 'Загрузка...', false);
            const config = await loadConfig();
            if (!config.supabaseUrl || !config.supabaseAnonKey) {
                throw new Error('Нет SUPABASE_ANON_KEY или SUPABASE_URL');
            }
            const imageUrl = await uploadImageToStorage(file, config);
            await updateProductImage(productId, imageUrl);
            setStatus(uploadStatus, 'Готово', false);
            if (uploadFile) {
                uploadFile.value = '';
            }
            if (uploadProductId) {
                uploadProductId.value = '';
            }
        } catch (err) {
            setStatus(uploadStatus, err.message, true);
        }
    });
}

if (productName && productSku) {
    productName.addEventListener('input', () => {
        productSku.value = generateSku(productName.value);
    });
}

if (createProductForm) {
    createProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = productName ? productName.value.trim() : '';
        const sku = productSku ? productSku.value.trim() : '';
        const categoryId = productCategory ? productCategory.value : '';
        const description = productDescription ? productDescription.value.trim() : '';
        const priceValue = productPrice ? productPrice.value : '';
        const stockValue = productStock ? productStock.value : '';
        const file = productImage && productImage.files ? productImage.files[0] : null;

        if (!name || !categoryId || priceValue === '' || stockValue === '') {
            setStatus(createProductStatus, 'Заполните все обязательные поля', true);
            return;
        }

        try {
            setStatus(createProductStatus, 'Создаем товар...', false);
            const productPayload = {
                name,
                sku: sku || generateSku(name),
                category_id: categoryId,
                notes: description || null,
                min_stock: Number(stockValue),
                status: 'active'
            };

            const createdProduct = await createProductRecord(productPayload);
            if (!createdProduct) {
                throw new Error('Товар не создан');
            }

            await createPriceRecord(createdProduct.id, priceValue);

            if (file) {
                const config = await loadConfig();
                if (!config.supabaseUrl || !config.supabaseAnonKey) {
                    throw new Error('Нет SUPABASE_ANON_KEY или SUPABASE_URL');
                }
                const imageUrl = await uploadImageToStorage(file, config);
                await updateProductImage(createdProduct.id, imageUrl);
            }

            setStatus(createProductStatus, 'Товар создан', false);
            if (createProductForm) {
                createProductForm.reset();
            }
            if (productSku) {
                productSku.value = '';
            }
        } catch (err) {
            setStatus(createProductStatus, err.message, true);
        }
    });
}

requireAdmin().then((ok) => {
    if (ok) {
        loadData();
        loadCategories();
    }
});
