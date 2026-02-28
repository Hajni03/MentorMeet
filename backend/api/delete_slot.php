<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->slot_id)) {
    try {
        // Töröljük az időpontot az idopontok táblából
        // (A foglalás már 'rejected' státusszal megmarad a foglalasok táblában naplózásnak, 
        // de az időpont eltűnik a kínálatból)
        $sql = "DELETE FROM idopontok WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data->slot_id]);

        echo json_encode(["message" => "Időpont sikeresen törölve."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó ID."]);
}
?>