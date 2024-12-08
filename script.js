const courseSelect = document.getElementById('c');
const groupSelect = document.getElementById('g');
const groups = {
    c1: ['11Д', '12П', '13Ф', '14К', '15Т'],
    c2: ['21Д', '22П', '23Ф', '24К', '25Т'],
    c3: ['31Д', '32П', '33Ф', '34К', '35Т'],
    c4: ['41Д', '42П', '43Ф', '44К', '45Т'],
    c5: ['54К']
};

// Обработчик изменения курса
courseSelect.addEventListener('change', function() {
    const selectedCourse = this.value;
    
    // Очистка списка групп
    groupSelect.innerHTML = '<option value="">Выберите группу</option>';
    
    if (selectedCourse) {
        // Получаем группы для выбранного курса
        const availableGroups = groups[selectedCourse];
        
        // Заполняем список групп
        availableGroups.forEach(function(group) {
            const option = document.createElement('option');
            option.value = group; // Значение остается прежним
            option.textContent = group; // Отображаемое значение
            groupSelect.appendChild(option);
        });
    }
});

// Обработчик отправки формы авторизации
document.getElementById('auth-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Проверка логина и пароля
    if (username === 'логин' && password === 'пароль') {
        document.getElementById('auth-message').style.display = 'block'; // Показываем сообщение об успешной авторизации
        document.getElementById('edit-button').style.display = 'block'; // Показываем кнопку редактирования
    } else {
        alert('Неверный логин или пароль');
    }
});

// Обработчик отправки формы расписания
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const group = groupSelect.value;
    const date = document.getElementById('date').value;

    if (!group || !date) {
        alert('Пожалуйста, выберите группу и дату.');
        return;
    }

    // Запрос на получение расписания
    fetch(`/get-schedule?group=${group}&date=${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении расписания');
            }
            return response.json();
        })
        .then(data => {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Очищаем предыдущее расписание

            // Отображаем расписание
            const scheduleText = data.schedule || 'Расписание не найдено.';
            scheduleDiv.innerText = scheduleText;

            // Добавляем возможность редактирования
            const editButton = document.getElementById('edit-button');
            editButton.onclick = function() {
                const newText = prompt('Введите новое расписание:', scheduleText);
                if (newText !== null) {
                    // Отправляем изменения на сервер
                    fetch('/save-schedule', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            group: group,
                            date: date,
                            content: newText
                        }),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ошибка при сохранении расписания');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log(data); // Выводим сообщение об успешном сохранении
                        scheduleDiv.innerText = newText; // Обновляем отображаемое расписание
                    })
                    .catch(error => {
                        console.error('Ошибка:', error); // Выводим ошибку в консоль
                        alert('Ошибка при сохранении расписания');
                    });
                }
            };
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при получении расписания');
        });
});
