const tokenKey = 'sb_access_token';
const loginBtn = document.getElementById('loginBtn');
const profileBtn = document.getElementById('profileBtn');

function renderAuthState(isAuthed) {
    if (loginBtn) {
        loginBtn.hidden = isAuthed;
    }
    if (profileBtn) {
        profileBtn.hidden = !isAuthed;
    }
}

async function syncAuthButtons() {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
        renderAuthState(false);
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            localStorage.removeItem(tokenKey);
            renderAuthState(false);
            return;
        }
        renderAuthState(true);
    } catch (err) {
        renderAuthState(false);
    }
}

syncAuthButtons();

window.addEventListener('storage', (event) => {
    if (event.key === tokenKey) {
        syncAuthButtons();
    }
});
