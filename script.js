const courseSelect = document.getElementById('c');
const groupSelect = document.getElementById('g');
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');
const editScheduleButton = document.getElementById('edit-schedule');
const logoutButton = document.getElementById('logout');
const scheduleForm = document.getElementById('schedule-form');
const editScheduleForm = document.getElementById('edit-schedule-form');
const editScheduleTextarea = document.getElementById('edit-schedule');
const saveScheduleButton = document.getElementById('save-schedule');

const validCredentials = {
    username: 'логин',
    password: 'пароль'
};

const groups = {
    c1: ['11Д', '12П', '13Ф', '14К', '15Т'],
    c2: ['21Д', '22П', '23Ф', '24К', '25Т'],
    c3: ['31Д', '32П', '33Ф', '34К', '35Т'],
    c4: ['41Д', '42П', '43Ф', '44К', '45Т'],
    c5: ['54К']
};

// Обработчик авторизации
authForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validCredentials.username && password === validCredentials.password) {
        authMessage.textContent = 'Успешная авторизация!';
        authMessage.style.display = 'block';
        authForm.style.display = 'none';
        scheduleForm.style.display = 'block';
        editScheduleButton.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';
    } else {
        authMessage.textContent = 'Неверный логин или пароль.';
        authMessage.style.display = 'block';
    }
});

// Обработчик выхода из профиля
logoutButton.addEventListener('click', function() {
    authMessage.style.display = 'none';
    authForm.style.display = 'block';
    scheduleForm.style.display = 'none';
    editScheduleButton.style.display = 'none';
    logoutButton.style.display = 'none';
    editScheduleForm.style.display = 'none'; // Скрываем форму редактирования
});

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

// Обработчик отправки формы расписания
scheduleForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const group = groupSelect.value; // Получаем выбранную группу
    const date = document.getElementById('date').value; // Получаем выбранную дату

    // Проверка на наличие выбранной группы и даты
    if (group && date) {
        // Формируем URL для получения расписания
        const url = `https://a-dos0e5l9m-kr4nas-projects.vercel.app/schedule/${group}/${date}`;

        // Загружаем расписание
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Сеть не в порядке');
                }
                return response.text();
            })
            .then(data => {
                // Отображаем расписание
                document.getElementById('schedule').innerText = `Расписание для ${group} на ${date}:\n${data}`;
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById('schedule').innerText = 'Ошибка загрузки расписания';
            });
    } else {
        document.getElementById('schedule').innerText = 'Пожалуйста, выберите группу и дату.';
    }
});

// Обработчик нажатия на кнопку редактирования расписания
editScheduleButton.addEventListener('click', function() {
    editScheduleForm.style.display = 'block'; // Показываем форму редактирования
});

// Обработчик сохранения расписания
saveScheduleButton.addEventListener('click', function() {
    const newSchedule = editScheduleTextarea.value; // Получаем новое расписание
    const group = groupSelect.value; // Получаем выбранную группу
    const date = document.getElementById('date').value; // Получаем выбранную дату

    if (newSchedule && group && date) {
        // Отправляем новое расписание на сервер
        fetch('https://a-dos0e5l9m-kr4nas-projects.vercel.app/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ group, date, schedule: newSchedule })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сохранения расписания');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            editScheduleForm.style.display = 'none';
            editScheduleTextarea.value = ''; // Очищаем текстовое поле
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка сохранения расписания');
        });
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
});
