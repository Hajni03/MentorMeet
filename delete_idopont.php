<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// OPTIONS kérés kezelése (Angular pre-flight miatt)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    try {
        // Opcionális: itt ellenőrizhetnéd a tanár ID-ját is a session-ből, 
        // hogy ne törölhessen mástól véletlenül.
        $stmt = $pdo->prepare("DELETE FROM idopontok WHERE id = ?");
        $result = $stmt->execute([$data['id']]);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Időpont törölve!"]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nem sikerült a törlés."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Hiányzó azonosító!"]);
}
?>