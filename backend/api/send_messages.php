<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu"); // Éles domain használata
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['kuldo_id']) && !empty($data['fogado_id']) && !empty($data['szoveg'])) {
    try {
        // A 'datum' oszlopba beírjuk az aktuális szerveridőt, az 'idopont' pedig marad NULL (mert még olvasatlan)
        $sql = "INSERT INTO uzenetek (kuldo_id, fogado_id, szoveg, datum, olvasott) VALUES (?, ?, ?, NOW(), 0)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$data['kuldo_id'], $data['fogado_id'], $data['szoveg']])) {
            echo json_encode(["status" => "success", "message" => "Üzenet elmentve"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Nem sikerült menteni"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok"]);
}