// --- Фільтрація каталогу (існуючий код) ---
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-button');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) { // Перевірка наявності елементів
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filterValue = this.getAttribute('data-filter');

                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Керування темою (новий код) ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const bodyElement = document.body;

    // Функція для застосування теми
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            bodyElement.classList.add('dark-theme');
            if (themeToggleButton) {
                themeToggleButton.textContent = '☀️'; // Іконка сонця
                themeToggleButton.setAttribute('aria-label', 'Змінити на світлу тему');
            }
        } else {
            bodyElement.classList.remove('dark-theme');
            if (themeToggleButton) {
                themeToggleButton.textContent = '🌙'; // Іконка місяця
                themeToggleButton.setAttribute('aria-label', 'Змінити на темну тему');
            }
        }
    };

    // Застосовуємо збережену тему або системну перевагу при завантаженні
    // Перевіряємо localStorage першим
    let currentTheme = localStorage.getItem('theme');

    // Якщо в localStorage немає, перевіряємо системні налаштування
    if (!currentTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light'; // За замовчуванням світла
        }
    }

    applyTheme(currentTheme); // Застосовуємо визначену тему

    // Обробник кліку на кнопку
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = bodyElement.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme); // Застосовуємо нову тему
            localStorage.setItem('theme', newTheme); // Зберігаємо вибір
        });
    }

    // Слухач зміни системної теми (якщо користувач не вибрав тему вручну)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Перевіряємо, чи користувач вже зробив вибір (збережено в localStorage)
        if (!localStorage.getItem('theme')) {
            const newColorScheme = event.matches ? "dark" : "light";
            applyTheme(newColorScheme);
            // Не зберігаємо в localStorage, щоб залишати перевагу системі
        }
    });
    // --- Керування модальним вікном ---
    const modal = document.getElementById('product-modal');
    const closeButton = modal.querySelector('.close-button');
    const detailButtons = document.querySelectorAll('.details-button'); // Всі кнопки "Детальніше"

    // Елементи всередині модального вікна для заповнення
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    // const modalBuyButton = document.getElementById('modal-buy-button'); // Якщо потрібно змінювати посилання

    // Функція відкриття модального вікна
    const openModal = (imgSrc, title, description, price) => {
        modalImg.src = imgSrc;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalPrice.textContent = price;
        // modalBuyButton.href = `/checkout.html?product=${encodeURIComponent(title)}`; // Можна передавати дані товару
        modal.classList.add('active'); // Показуємо вікно
    };

    // Функція закриття модального вікна
    const closeModal = () => {
        modal.classList.remove('active'); // Ховаємо вікно
    };

    // Додаємо обробники подій на кнопки "Детальніше"
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Запобігти переходу за посиланням '#'

            // Знаходимо батьківську картку товару
            const card = button.closest('.product-card');
            if (!card) return; // Якщо картку не знайдено

            // Отримуємо дані з картки
            const imgSrc = card.querySelector('img')?.src || ''; // Оператор ?. для безпеки
            const title = card.querySelector('h3')?.textContent || 'Назва не знайдена';
            const description = card.querySelector('.description')?.textContent || 'Опис відсутній.';
            const price = card.querySelector('.price')?.textContent || 'Ціна не вказана';

            // Відкриваємо модальне вікно з отриманими даними
            openModal(imgSrc, title, description, price);
        });
    });

    // Закриття модального вікна по кліку на хрестик
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Закриття модального вікна по кліку поза контентом
    modal.addEventListener('click', (event) => {
        if (event.target === modal) { // Клік саме на фоні (overlay)
            closeModal();
        }
    });

    // Закриття модального вікна по натисканню клавіші Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

}); // Кінець обгортки DOMContentLoaded