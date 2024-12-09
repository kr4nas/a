document.getElementById('auth').addEventListener('click', function() {
    window.location.href = 'login.html';
});

// Проверяем состояние авторизации
if (sessionStorage.getItem('isAuthenticated') === 'true') {
    // Если пользователь авторизован, показываем кнопки выхода и редактирования
    document.querySelector('.exit').style.display = 'block';
    document.querySelector('.edit').style.display = 'block';
    document.querySelector('.b').style.display = 'none'; // Скрываем кнопку авторизации
}

// Обработчик для кнопки "Выйти из профиля"
document.getElementById('exit').addEventListener('click', function() {
    // Удаляем информацию о авторизации
    sessionStorage.removeItem('isAuthenticated');
    // Перезагружаем страницу для возврата к исходному состоянию
    window.location.reload();
});

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

// Обработчик отправки формы расписания
document.getElementById('r-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const group = groupSelect.value; // Получаем выбранную группу
    const date = document.getElementById('date').value; // Получаем выбранную дату

    // Проверка на наличие выбранной группы и даты
    if (group && date) {
        // Формируем имя папки и файла на основе выбранной даты и группы
        const formattedDate = date.split('-').join('-'); // Преобразуем дату в нужный формат
        const fileName = `${group}.txt`; // Имя файла
        const folderPath = `https://kr4nas.github.io/a/${formattedDate}/`; // Путь к папке

        // Загружаем расписание
        fetch(folderPath + fileName)
            .then(response => {
                console.log('Response status:', response.status); // Выводим статус ответа
                if (!response.ok) {
                    throw new Error('Сеть не в порядке');
                }
                return response.text();
            })
            .then(data => {
                // Отображаем расписание
                document.getElementById('r').innerText = `Расписание для ${group} на ${date}:\n${data}`;
            })
            .catch(error => {
                console.error('Ошибка:', error); // Выводим ошибку в консоль
                document.getElementById('r').innerText = 'Ошибка загрузки расписания.';
            });
    } else {
        // Если не выбраны группа или дата, выводим сообщение
        document.getElementById('r').innerText = 'Пожалуйста, выберите группу и дату.';
    }
});

// Обработчик для кнопки "Редактировать расписание"
document.getElementById('edit').addEventListener('click', function() {
    document.querySelector('.edit-schedule').style.display = 'block'; // Показываем текстовое поле
    document.getElementById('r').style.display = 'none'; // Скрываем область с расписанием
});

// Обработчик для кнопки "Сохранить изменения"
document.getElementById('save-nn').addEventListener('click', function() {
    const editedSchedule = document.getElementById('nn-edit').value; // Получаем текст из текстового поля
    const group = groupSelect.value; // Получаем выбранную группу
    const date = document.getElementById('date').value; // Получаем выбранную дату

    if (group && date) {
        // Отправляем запрос на сервер
        fetch(`/nn/update_nn/${group}/${date}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: editedSchedule })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при сохранении файла');
            }
            alert('Изменения сохранены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении изменений.');
        });
    } else {
        alert('Пожалуйста, выберите группу и дату перед сохранением.');
    }
});
