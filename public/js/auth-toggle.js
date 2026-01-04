const tokenKey = 'sb_access_token';
const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
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
        const data = await response.json();
        if (profileBtn) {
            profileBtn.href = data.isAdmin ? 'admin.html' : 'profile.html';
        }
        renderAuthState(true);
    } catch (err) {
        renderAuthState(false);
    }
}

syncAuthButtons();

if (hashParams.has('access_token')) {
    const accessToken = hashParams.get('access_token');
    if (accessToken) {
        localStorage.setItem(tokenKey, accessToken);
    }
    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    syncAuthButtons();
}

window.addEventListener('storage', (event) => {
    if (event.key === tokenKey) {
        syncAuthButtons();
    }
});
