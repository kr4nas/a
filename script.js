document.getElementById('auth').addEventListener('click', function() {
    window.location.href = 'login.html';
});

if (sessionStorage.getItem('isAuthenticated') === 'true') {
    document.querySelector('.exit').style.display = 'block';
    document.querySelector('.edit').style.display = 'block';
    document.querySelector('.b').style.display = 'none'; 
}

document.getElementById('exit').addEventListener('click', function() {
    sessionStorage.removeItem('isAuthenticated');
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

courseSelect.addEventListener('change', function() {
    const selectedCourse = this.value;
    groupSelect.innerHTML = '<option value="">Выберите группу</option>';
    if (selectedCourse) {
        const availableGroups = groups[selectedCourse];
        availableGroups.forEach(function(group) {
            const option = document.createElement('option');
            option.value = group; 
            option.textContent = group; 
            groupSelect.appendChild(option);
        });
    }
});
function showSchedule() {
    const scheduleElement = document.getElementById('r');
    scheduleElement.classList.toggle('visible'); 
}
let toggleCount = 0; 
document.getElementById('r-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const group = groupSelect.value; 
    const date = document.getElementById('date').value; 
    const button = document.querySelector('button[type="submit"]');
    if (group && date) {
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}.${month}.${year}`; 
        const folderPath = `https://kr4nas.github.io/a/${date}/`; 

        fetch(folderPath + `${group}.txt`)
            .then(response => {
                console.log('Response status:', response.status); 
                if (!response.ok) {
                    throw new Error('Сеть не в порядке');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('r').innerText = `Расписание для ${group} на ${formattedDate}:\n${data}`;
                showSchedule(); 
                
                toggleCount++;
                button.innerText = (toggleCount % 2 === 1) ? 'Скрыть расписание' : 'Показать расписание';
            })
            .catch(error => {
                console.error('Ошибка:', error); 
                document.getElementById('r').innerText = 'Ошибка загрузки расписания.';
            });
    } else {
        document.getElementById('r').innerText = 'Пожалуйста, выберите группу и дату.';
    }
});

document.getElementById('edit').addEventListener('click', function() {
    document.querySelector('.edit-schedule').style.display = 'block'; 
    document.getElementById('r').style.display = 'none'; 
});

document.getElementById('save-nn').addEventListener('click', function() {
    const editedSchedule = document.getElementById('nn-edit').value;
    const group = groupSelect.value; 
    const date = document.getElementById('date').value; 

    if (group && date) {
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