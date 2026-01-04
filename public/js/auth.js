const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const resendButtons = document.querySelectorAll('[data-resend]');
const resendMessage = document.getElementById('resendMessage');
const lastEmailKey = 'auth_last_email';
const urlParams = new URLSearchParams(window.location.search);

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    const text = await response.text();
    return { error: text || 'Unexpected response format' };
}

function setAuthMessage(target, text, isError) {
    if (!target) {
        return;
    }
    target.textContent = text;
    target.classList.toggle('isError', Boolean(isError));
}

function storeSession(session) {
    if (!session || !session.access_token) {
        return;
    }
    localStorage.setItem('sb_access_token', session.access_token);
}

function storeLastEmail(email) {
    if (!email) {
        return;
    }
    localStorage.setItem(lastEmailKey, String(email));
}

function getLastEmail() {
    return localStorage.getItem(lastEmailKey);
}

async function resendEmail(email) {
    if (!email) {
        setAuthMessage(resendMessage, 'Введите email при регистрации или входе.', true);
        return null;
    }
    setAuthMessage(resendMessage, 'Отправляем письмо...');
    try {
        const response = await fetch('/api/auth/resend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await parseResponse(response);
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка отправки');
        }
        setAuthMessage(resendMessage, 'Письмо отправлено. Проверьте почту.', false);
        return data;
    } catch (err) {
        setAuthMessage(resendMessage, err.message, true);
        return null;
    }
}

async function handleAuth(endpoint, payload, messageTarget) {
    setAuthMessage(messageTarget, 'Загрузка...');
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await parseResponse(response);
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка запроса');
        }

        if (payload && payload.email) {
            storeLastEmail(payload.email);
        }

        if (data.session) {
            storeSession(data.session);
        }

        return data;
    } catch (err) {
        setAuthMessage(messageTarget, err.message, true);
        return null;
    }
}

if (loginForm) {
    if (urlParams.get('registered') === '1') {
        setAuthMessage(loginMessage, 'Проверьте почту для подтверждения, затем войдите.', false);
    }
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const result = await handleAuth('/api/auth/login', { email, password }, loginMessage);
        if (result && result.session) {
            window.location.href = 'index.html';
        } else if (result) {
            setAuthMessage(loginMessage, 'Проверьте подтверждение почты.', true);
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const email = formData.get('email');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const result = await handleAuth(
            '/api/auth/register',
            { email, password, name, phone },
            registerMessage
        );
        if (result) {
            window.location.href = 'login.html?registered=1';
        }
    });
}

if (resendButtons.length) {
    resendButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const email = getLastEmail();
            resendEmail(email);
        });
    });
}
