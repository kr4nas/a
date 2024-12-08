const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Эндпоинт для получения расписания
app.get('/schedule/:group/:date', (req, res) => {
    const { group, date } = req.params;
    const filePath = path.join(__dirname, 'schedules', `${date}-${group}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Расписание не найдено');
        }
        res.send(data);
    });
});

// Эндпоинт для сохранения расписания
app.post('/schedule', (req, res) => {
    const { group, date, schedule } = req.body;
    const filePath = path.join(__dirname, 'schedules', `${date}-${group}.txt`);

    fs.writeFile(filePath, schedule, (err) => {
        if (err) {
            return res.status(500).send('Ошибка сохранения расписания');
        }
        res.send('Расписание успешно сохранено');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});