<?php

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['date']) && isset($data['group']) && isset($data['schedule'])) {
    $date = $data['date'];
    $group = $data['group'];
    $schedule = $data['schedule'];
    $folderPath = __DIR__ . '/' . $date;
    if (!is_dir($folderPath)) {
        mkdir($folderPath, 0777, true);
    }
    $filePath = $folderPath . '/' . $group . '.txt';
    if (file_put_contents($filePath, $schedule) !== false) {
        echo json_encode(['status' => 'success', 'message' => 'Расписание успешно сохранено.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка сохранения.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Недопустимый ввод.']);
}
?>