<?php
header('Content-Type: application/json');
$date = $_GET['date'] ?? null;
$group = $_GET['group'] ?? null;
if ($date && $group) {
    $filePath = __DIR__ . '/' . $date . '/' . $group . '.txt';
    if (file_exists($filePath)) {
        $schedule = file_get_contents($filePath);
        echo json_encode(['status' => 'success', 'schedule' => $schedule]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Расписание не найдено.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Недопустимый ввод.']);
}
?>