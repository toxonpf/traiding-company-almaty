const tokenKey = 'sb_access_token';
const logoutBtn = document.querySelector('[data-logout]');
const avatarEl = document.getElementById('profileAvatar');
const nameEl = document.getElementById('profileName');
const fullNameEl = document.getElementById('profileFullName');
const emailEl = document.getElementById('profileEmail');
const phoneEl = document.getElementById('profilePhone');
const lastSignInEl = document.getElementById('profileLastSignIn');

function setActiveTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
    const button = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    const section = document.getElementById(tabId);
    if (button) {
        button.classList.add('active');
    }
    if (section) {
        section.classList.add('active');
    }
}

function formatDate(value) {
    if (!value) {
        return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString('ru-RU');
}

function renderInitials(fullName) {
    const trimmed = String(fullName || '').trim();
    if (!trimmed) {
        return '--';
    }
    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0].toUpperCase()).join('');
}

async function loadProfile() {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки профиля');
        }

        const fullName = data.name || '';
        if (avatarEl) {
            avatarEl.textContent = renderInitials(fullName);
        }
        if (nameEl) {
            nameEl.textContent = fullName || data.email || 'Пользователь';
        }
        if (fullNameEl) {
            fullNameEl.textContent = fullName || '-';
        }
        if (emailEl) {
            emailEl.textContent = data.email || '-';
        }
        if (phoneEl) {
            phoneEl.textContent = data.phone || '-';
        }
        if (lastSignInEl) {
            lastSignInEl.textContent = formatDate(data.lastSignInAt);
        }
    } catch (err) {
        localStorage.removeItem(tokenKey);
        window.location.href = 'login.html';
    }
}

document.querySelectorAll('.nav-btn[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        if (tabId) {
            setActiveTab(tabId);
        }
    });
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(tokenKey);
        window.location.href = 'login.html';
    });
}

loadProfile();
