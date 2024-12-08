const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/save-schedule', (req, res) => {
    const { group, date, content } = req.body;
    const fileName = `${group}.txt`;
    const folderPath = `./schedules/${date}/`; // Путь к папке

    // Создаем папку, если она не существует
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Записываем содержимое в файл
    fs.writeFile(`${folderPath}${fileName}`, content, (err) => {
        if (err) {
            return res.status(500).send('Ошибка при сохранении файла');
        }
        res.send('Файл успешно сохранен');
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});