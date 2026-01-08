lucide.createIcons();

const tabs = document.querySelectorAll('.menu-link[data-tab]');
const sections = document.querySelectorAll('.panelSection');
const titleEl = document.getElementById('panelTitle');
const subtitleEl = document.getElementById('panelSubtitle');

const tabCopy = {
    data: { title: 'Данные', subtitle: 'Управляйте таблицами и данными.' },
    create: { title: 'Создание', subtitle: 'Добавляйте новые записи в таблицы.' },
    update: { title: 'Обновление', subtitle: 'Редактируйте существующие записи.' },
    delete: { title: 'Удаление', subtitle: 'Удаляйте записи из базы.' },
    upload: { title: 'Изображения', subtitle: 'Загружайте фото товаров в Storage.' }
};

function setActiveTab(tabId) {
    tabs.forEach((tab) => tab.classList.remove('active'));
    sections.forEach((section) => section.classList.remove('active'));
    const targetTab = document.querySelector(`.menu-link[data-tab="${tabId}"]`);
    const targetSection = document.querySelector(`.panelSection[data-section="${tabId}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    if (targetSection) {
        targetSection.classList.add('active');
    }
    const copy = tabCopy[tabId];
    if (copy && titleEl && subtitleEl) {
        titleEl.textContent = copy.title;
        subtitleEl.textContent = copy.subtitle;
    }
}

tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        const tabId = tab.getAttribute('data-tab');
        if (tabId) {
            setActiveTab(tabId);
        }
    });
});
