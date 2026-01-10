const languageBtn = document.getElementById('languageBtn');
const languageMenu = document.getElementById('languageMenu');
const languageKey = 'site_language';

const translations = {
    ru: {
        page: {
            home: 'Главная',
            catalog: 'Каталог',
            login: 'Вход',
            register: 'Регистрация',
            profile: 'Профиль пользователя',
            admin: 'Админ-панель',
            product: 'Товар'
        },
        nav: { home: 'Главная', catalog: 'Каталог', login: 'Войти' },
        search: { placeholder: 'Поиск по каталогу...' },
        catalog: {
            title: 'Каталог товаров',
            subtitle: 'Выберите нужную категорию или воспользуйтесь поиском.',
            rubricator: 'Рубрикатор',
            countLabel: 'Товаров:',
            empty: 'Ничего не найдено.',
            searchPlaceholder: 'Поиск товаров...',
            all: 'Все категории',
            filtersTitle: 'Фильтры',
            priceLabel: 'Цена',
            priceMin: 'от',
            priceMax: 'до',
            manufacturerLabel: 'Производитель',
            countryLabel: 'Страна',
            any: 'Любой',
            reset: 'Сбросить'
        },
        product: {
            catalog: 'Каталог',
            back: 'Назад к каталогу',
            addToCart: 'Добавить в корзину',
            details: 'Характеристики',
            descriptionTitle: 'Описание',
            priceOnRequest: 'Цена по запросу'
        },
        side: { home: 'Главная', catalog: 'Каталог', favorites: 'Избранное', orders: 'Заказы' },
        slider: { nature: 'Природа', urban: 'Город', ocean: 'Океан', space: 'Космос' },
        auth: {
            backHome: 'На сайт',
            back: 'Вернуться',
            titleLogin: 'Вход',
            titleRegister: 'Регистрация',
            subtitleLogin: 'Войдите в свой аккаунт для доступа к системе',
            subtitleRegister: 'Создайте аккаунт для доступа к системе',
            email: 'Email',
            name: 'Имя',
            phone: 'Телефон',
            password: 'Пароль',
            signIn: 'Войти',
            signUp: 'Создать аккаунт',
            resendTitleLogin: 'Не подтверждено письмо?',
            resendTitleRegister: 'Не пришло письмо?',
            resendBtnLogin: 'Отправить подтверждение',
            resendBtnRegister: 'Отправить еще раз',
            noAccount: 'Нет аккаунта?',
            haveAccount: 'Уже есть аккаунт?',
            register: 'Регистрация'
        },
        profile: {
            title: 'Личные данные',
            tabProfile: 'Профиль',
            tabOrders: 'Мои заказы',
            tabSettings: 'Настройки',
            logout: 'Выйти',
            status: 'Premium клиент',
            fullName: 'Полное имя',
            email: 'Email',
            phone: 'Телефон',
            lastSignIn: 'Последний вход',
            bannerTitle: 'Ваша скидка 15%',
            bannerText: 'Действует до конца месяца на все товары категории "Электроника"',
            ordersTitle: 'История заказов',
            ordersEmpty: 'У вас пока нет активных заказов.',
            settingsTitle: 'Настройки',
            settingsEmpty: 'Раздел в разработке.'
        },
        admin: {
            title: 'Админ-панель',
            back: 'На сайт',
            logout: 'Выйти',
            data: 'Данные',
            table: 'Таблица',
            limit: 'Лимит',
            load: 'Загрузить',
            createTitle: 'Создание записи',
            create: 'Создать',
            updateTitle: 'Обновление записи',
            update: 'Обновить',
            deleteTitle: 'Удаление записи',
            delete: 'Удалить',
            idPlaceholder: 'id записи'
        },
        footer: {
            brandDesc: 'Мы создаем лучший опыт онлайн-покупок с заботой о каждом клиенте и вниманием к деталям.',
            storeTitle: 'Магазин',
            helpTitle: 'Помощь',
            newsTitle: 'Узнавайте первым',
            newsText: 'Подпишитесь на рассылку новостей и секретных промокодов.',
            linkCatalog: 'Каталог товаров',
            linkNew: 'Новинки',
            linkDeals: 'Акции и скидки',
            linkBrands: 'Бренды',
            linkDelivery: 'Доставка',
            linkReturn: 'Возврат товара',
            linkFaq: 'FAQ',
            linkContacts: 'Контакты',
            emailPlaceholder: 'Ваш email',
            subscribeBtn: 'OK',
            copy: '© 2025 ModernShop. Все права защищены.',
            privacy: 'Политика конфиденциальности',
            terms: 'Условия использования'
        }
    },
    en: {
        page: {
            home: 'Home',
            catalog: 'Catalog',
            login: 'Sign in',
            register: 'Sign up',
            profile: 'User profile',
            admin: 'Admin panel',
            product: 'Product'
        },
        nav: { home: 'Home', catalog: 'Catalog', login: 'Sign in' },
        search: { placeholder: 'Search the catalog...' },
        catalog: {
            title: 'Product catalog',
            subtitle: 'Choose a category or use the search.',
            rubricator: 'Categories',
            countLabel: 'Items:',
            empty: 'No products found.',
            searchPlaceholder: 'Search products...',
            all: 'All categories',
            filtersTitle: 'Filters',
            priceLabel: 'Price',
            priceMin: 'min',
            priceMax: 'max',
            manufacturerLabel: 'Manufacturer',
            countryLabel: 'Country',
            any: 'Any',
            reset: 'Reset'
        },
        product: {
            catalog: 'Catalog',
            back: 'Back to catalog',
            addToCart: 'Add to cart',
            details: 'Details',
            descriptionTitle: 'Description',
            priceOnRequest: 'Price on request'
        },
        side: { home: 'Home', catalog: 'Catalog', favorites: 'Favorites', orders: 'Orders' },
        slider: { nature: 'Nature', urban: 'Urban', ocean: 'Ocean', space: 'Space' },
        auth: {
            backHome: 'Back to site',
            back: 'Back',
            titleLogin: 'Sign in',
            titleRegister: 'Sign up',
            subtitleLogin: 'Sign in to access the system',
            subtitleRegister: 'Create an account to access the system',
            email: 'Email',
            name: 'Name',
            phone: 'Phone',
            password: 'Password',
            signIn: 'Sign in',
            signUp: 'Create account',
            resendTitleLogin: 'Email not confirmed?',
            resendTitleRegister: 'Email not received?',
            resendBtnLogin: 'Resend confirmation',
            resendBtnRegister: 'Send again',
            noAccount: 'No account?',
            haveAccount: 'Already have an account?',
            register: 'Sign up'
        },
        profile: {
            title: 'Personal details',
            tabProfile: 'Profile',
            tabOrders: 'My orders',
            tabSettings: 'Settings',
            logout: 'Sign out',
            status: 'Premium customer',
            fullName: 'Full name',
            email: 'Email',
            phone: 'Phone',
            lastSignIn: 'Last sign in',
            bannerTitle: 'Your 15% discount',
            bannerText: 'Valid until the end of the month for all products in "Electronics"',
            ordersTitle: 'Order history',
            ordersEmpty: 'You do not have any active orders yet.',
            settingsTitle: 'Settings',
            settingsEmpty: 'Section under construction.'
        },
        admin: {
            title: 'Admin panel',
            back: 'Back to site',
            logout: 'Sign out',
            data: 'Data',
            table: 'Table',
            limit: 'Limit',
            load: 'Load',
            createTitle: 'Create record',
            create: 'Create',
            updateTitle: 'Update record',
            update: 'Update',
            deleteTitle: 'Delete record',
            delete: 'Delete',
            idPlaceholder: 'record id'
        },
        footer: {
            brandDesc: 'We create the best online shopping experience with care for every customer.',
            storeTitle: 'Shop',
            helpTitle: 'Help',
            newsTitle: 'Stay in the loop',
            newsText: 'Subscribe for news and special promo codes.',
            linkCatalog: 'Product catalog',
            linkNew: 'New arrivals',
            linkDeals: 'Deals & discounts',
            linkBrands: 'Brands',
            linkDelivery: 'Delivery',
            linkReturn: 'Returns',
            linkFaq: 'FAQ',
            linkContacts: 'Contacts',
            emailPlaceholder: 'Your email',
            subscribeBtn: 'OK',
            copy: '© 2025 ModernShop. All rights reserved.',
            privacy: 'Privacy policy',
            terms: 'Terms of use'
        }
    },
    kk: {
        page: {
            home: 'Басты бет',
            catalog: 'Каталог',
            login: 'Кіру',
            register: 'Тіркелу',
            profile: 'Пайдаланушы профилі',
            admin: 'Әкімші панелі',
            product: 'Тауар'
        },
        nav: { home: 'Басты бет', catalog: 'Каталог', login: 'Кіру' },
        search: { placeholder: 'Каталог бойынша іздеу...' },
        catalog: {
            title: 'Тауарлар каталогы',
            subtitle: 'Қажетті санатты таңдаңыз немесе іздеуді қолданыңыз.',
            rubricator: 'Рубрикатор',
            countLabel: 'Тауарлар:',
            empty: 'Ештеңе табылмады.',
            searchPlaceholder: 'Тауарды іздеу...',
            all: 'Барлық санаттар',
            filtersTitle: 'Сүзгілер',
            priceLabel: 'Баға',
            priceMin: 'мин',
            priceMax: 'макс',
            manufacturerLabel: 'Өндіруші',
            countryLabel: 'Ел',
            any: 'Кез келген',
            reset: 'Тазалау'
        },
        product: {
            catalog: 'Каталог',
            back: 'Каталогқа қайту',
            addToCart: 'Себетке қосу',
            details: 'Сипаттамалары',
            descriptionTitle: 'Сипаттама',
            priceOnRequest: 'Баға сұраныс бойынша'
        },
        side: { home: 'Басты бет', catalog: 'Каталог', favorites: 'Таңдаулылар', orders: 'Тапсырыстар' },
        slider: { nature: 'Табиғат', urban: 'Қала', ocean: 'Мұхит', space: 'Ғарыш' },
        auth: {
            backHome: 'Сайтқа оралу',
            back: 'Қайту',
            titleLogin: 'Кіру',
            titleRegister: 'Тіркелу',
            subtitleLogin: 'Жүйеге кіру үшін аккаунтыңызға кіріңіз',
            subtitleRegister: 'Жүйеге кіру үшін аккаунт жасаңыз',
            email: 'Email',
            name: 'Аты',
            phone: 'Телефон',
            password: 'Құпиясөз',
            signIn: 'Кіру',
            signUp: 'Аккаунт жасау',
            resendTitleLogin: 'Пошта расталмады ма?',
            resendTitleRegister: 'Хат келмеді ме?',
            resendBtnLogin: 'Растауды қайта жіберу',
            resendBtnRegister: 'Қайта жіберу',
            noAccount: 'Аккаунт жоқ па?',
            haveAccount: 'Аккаунтыңыз бар ма?',
            register: 'Тіркелу'
        },
        profile: {
            title: 'Жеке деректер',
            tabProfile: 'Профиль',
            tabOrders: 'Тапсырыстарым',
            tabSettings: 'Баптаулар',
            logout: 'Шығу',
            status: 'Premium клиент',
            fullName: 'Толық аты-жөні',
            email: 'Email',
            phone: 'Телефон',
            lastSignIn: 'Соңғы кіру',
            bannerTitle: 'Сіздің 15% жеңілдігіңіз',
            bannerText: '"Электроника" санатындағы барлық тауарларға ай соңына дейін жарамды',
            ordersTitle: 'Тапсырыстар тарихы',
            ordersEmpty: 'Белсенді тапсырыстарыңыз жоқ.',
            settingsTitle: 'Баптаулар',
            settingsEmpty: 'Бөлім әзірленуде.'
        },
        admin: {
            title: 'Әкімші панелі',
            back: 'Сайтқа оралу',
            logout: 'Шығу',
            data: 'Деректер',
            table: 'Кесте',
            limit: 'Лимит',
            load: 'Жүктеу',
            createTitle: 'Жазба құру',
            create: 'Құру',
            updateTitle: 'Жазбаны жаңарту',
            update: 'Жаңарту',
            deleteTitle: 'Жазбаны жою',
            delete: 'Жою',
            idPlaceholder: 'жазба id'
        },
        footer: {
            brandDesc: 'Біз әрбір клиентке қамқорлықпен үздік онлайн сатып алу тәжірибесін жасаймыз.',
            storeTitle: 'Дүкен',
            helpTitle: 'Көмек',
            newsTitle: 'Алғаш болып біліңіз',
            newsText: 'Жаңалықтар мен құпия промокодтарға жазылыңыз.',
            linkCatalog: 'Тауарлар каталогы',
            linkNew: 'Жаңалықтар',
            linkDeals: 'Акциялар мен жеңілдіктер',
            linkBrands: 'Брендтер',
            linkDelivery: 'Жеткізу',
            linkReturn: 'Қайтару',
            linkFaq: 'FAQ',
            linkContacts: 'Контактілер',
            emailPlaceholder: 'Email',
            subscribeBtn: 'OK',
            copy: '© 2025 ModernShop. Барлық құқықтар қорғалған.',
            privacy: 'Құпиялылық саясаты',
            terms: 'Қолдану шарттары'
        }
    }
};

function getTranslation(lang, key) {
    return key.split('.').reduce((acc, part) => (acc ? acc[part] : null), translations[lang]);
}

function applyLanguage(lang) {
    const locale = translations[lang] ? lang : 'ru';
    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        const value = getTranslation(locale, key);
        if (typeof value === 'string') {
            node.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
        const key = node.getAttribute('data-i18n-placeholder');
        const value = getTranslation(locale, key);
        if (typeof value === 'string') {
            node.setAttribute('placeholder', value);
        }
    });

    const titleKey = document.body ? document.body.getAttribute('data-i18n-title') : null;
    if (titleKey) {
        const title = getTranslation(locale, titleKey);
        if (title) {
            document.title = title;
        }
    }

    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        const allLabel = getTranslation(locale, 'catalog.all');
        if (allLabel) {
            categorySelect.setAttribute('data-all-label', allLabel);
        }
    }
    const manufacturerFilter = document.getElementById('manufacturerFilter');
    if (manufacturerFilter) {
        const anyLabel = getTranslation(locale, 'catalog.any');
        if (anyLabel) {
            manufacturerFilter.setAttribute('data-any-label', anyLabel);
        }
    }
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        const anyLabel = getTranslation(locale, 'catalog.any');
        if (anyLabel) {
            countryFilter.setAttribute('data-any-label', anyLabel);
        }
    }
    const breadcrumbs = document.getElementById('productBreadcrumbs');
    if (breadcrumbs) {
        const catalogLabel = getTranslation(locale, 'product.catalog');
        if (catalogLabel) {
            breadcrumbs.setAttribute('data-catalog-label', catalogLabel);
        }
    }

    localStorage.setItem(languageKey, locale);
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: locale } }));
}

function toggleMenu(forceOpen) {
    if (!languageMenu || !languageBtn) {
        return;
    }
    const nextState = typeof forceOpen === 'boolean' ? forceOpen : languageMenu.hasAttribute('hidden');
    languageMenu.toggleAttribute('hidden', !nextState);
    languageBtn.setAttribute('aria-expanded', String(nextState));
}

if (languageBtn && languageMenu) {
    languageBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    languageMenu.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const lang = target.getAttribute('data-lang');
        if (lang) {
            applyLanguage(lang);
            toggleMenu(false);
        }
    });

    document.addEventListener('click', () => {
        toggleMenu(false);
    });
}

const savedLang = localStorage.getItem(languageKey) || 'ru';
applyLanguage(savedLang);
