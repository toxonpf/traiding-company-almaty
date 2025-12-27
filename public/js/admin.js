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

requireAdmin().then((ok) => {
    if (ok) {
        loadData();
    }
});
