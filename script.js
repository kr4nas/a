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
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const group = groupSelect.value; // Получаем выбранную группу
    const date = document.getElementById('date').value; // Получаем выбранную дату

    // Проверка на наличие выбранной группы и даты
    if (group && date) {
        // Формируем имя папки и файла на основе выбранной даты и группы
        const formattedDate = date.split('-').join('-'); // Преобразуем дату в нужный формат
        const fileName = `${group}.txt`; // Имя файла
        const folderPath = `/${formattedDate}/`; // Путь к папке

        // Загружаем расписание
        fetch(folderPath + fileName)
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
                document.getElementById('schedule').innerText = 'Ошибка загрузки расписания';
            });
    } else {
        // Если не выбраны группа или дата, выводим сообщение
        document.getElementById('schedule').innerText = 'Пожалуйста, выберите группу и дату.';
    }
});