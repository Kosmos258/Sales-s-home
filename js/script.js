// Вход в гостевой режим
function validateLogin(event) {
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    if (login === '1' && password === '1') {
        window.location.href = 'main.html';
    } else {
        showModal('Неверный логин или пароль');
    }
}

// Появление модального окна при неуспешной ппоытки входа
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal_text');
    modalText.textContent = message;
    modal.style.display = 'block';

    const closeButton = document.querySelector('.close_button');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Окно фильрации для кнопок вверху
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter_button');
    let currentPopup = null;

    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Остановить всплытие события
            const popup = button.nextElementSibling;
            const arrow = button.querySelector('.img_strela_vniz');

            // Установить ширину popup равной ширине кнопки
            popup.style.width = `${button.offsetWidth}px`;

            if (currentPopup && currentPopup !== popup) {
                currentPopup.style.display = 'none';
                const currentArrow = currentPopup.previousElementSibling.querySelector('.img_strela_vniz');
                currentArrow.classList.remove('rotated');
            }

            if (popup.style.display === 'block') {
                popup.style.display = 'none';
                arrow.classList.remove('rotated');
                currentPopup = null;
            } else {
                popup.style.display = 'block';
                arrow.classList.add('rotated');
                currentPopup = popup;
            }
        });
});

// Обработчик клика на документе для закрытия выпадающих окон
    document.addEventListener('click', (event) => {
        if (currentPopup) {
            const target = event.target;
            if (!currentPopup.contains(target) && !target.classList.contains('filter_button')) {
                currentPopup.style.display = 'none';
                const currentArrow = currentPopup.previousElementSibling.querySelector('.img_strela_vniz');
                currentArrow.classList.remove('rotated');
                currentPopup = null;
            }
        }
    });
});

//  Пагинация 
document.addEventListener('DOMContentLoaded', function () {
    const pages = document.querySelectorAll('.pagination a');

    pages.forEach(page => {
      page.addEventListener('click', function (event) {
        event.preventDefault(); // Предотвращаем переход по ссылке
        pages.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });
    });
});

// Редирект на карточку дома
function redirectToCard(row) {
    const address = encodeURIComponent(row.cells[1].textContent.trim());
    window.location.href = `cardHouse.html?address=${address}`;
}

//  Фильтрация для таблицы
function applyFilters() {
    const filters = [
        { id: 'srok', type: 'range', column: 2 },
        { id: 'metro', type: 'range', column: 5 },
        { id: 'rayon', type: 'checkbox', column: 4 },
        { id: 'ploshad', type: 'range', column: 6 },
        { id: 'kuhnya', type: 'range', column: 7 },
        { id: 'cena-100', type: 'range', column: 8 }
    ];

    const getFilterValue = (id, suffix) => document.getElementById(`${id}-${suffix}`).value;
    const getCheckboxValue = (id) => document.getElementById(id).checked;

    document.querySelectorAll('#propertyTableBody .table_row').forEach(row => {
        let showRow = true;

        filters.forEach(filter => {
            const cellValue = row.cells[filter.column].textContent.trim();
            if (filter.type === 'checkbox') {
                if (filter.id === 'otdelka') {
                    const options = ['bez-otdelki', 's-otdelkoy', 'chistovaya']; // Опции для отделки
                    const anyOptionChecked = options.some(option => getCheckboxValue(`${filter.id}-${option}`));
                    if (anyOptionChecked && !options.some(option => 
                        getCheckboxValue(`${filter.id}-${option}`) && cellValue.includes(option))) {
                        showRow = false;
                    }
                } else if (filter.id === 'rayon') {
                    const options = ['center', 'north', 'south'];
                    const anyOptionChecked = options.some(option => getCheckboxValue(`${filter.id}-${option}`));
                    if (anyOptionChecked && !options.some(option => 
                        getCheckboxValue(`${filter.id}-${option}`) && cellValue.includes(option))) {
                        showRow = false;
                    }
                }
            } else if (filter.type === 'range') {
                const [min, max] = [getFilterValue(filter.id, 'ot'), getFilterValue(filter.id, 'do')];
                const numericValue = parseFloat(cellValue);
                if ((min && numericValue < parseFloat(min)) || (max && numericValue > parseFloat(max))) {
                    showRow = false;
                }
            }
        });

        row.style.display = showRow ? '' : 'none';
    });
}

//  Сброс настроек фильтра таблицы
function resetFilters() {
    // Сброс чекбоксов
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Сброс полей ввода
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });

    // Сброс полей диапазона (если они есть)
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.value = range.defaultValue;
    });

    // Применение фильтров после сброса
    applyFilters();
}

// Добавление обработчика события для кнопки сброса фильтров
document.getElementById('resetFiltersButton').addEventListener('click', resetFilters);