<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}

try {
    // Frissítjük a kapcsolat státuszát (accepted vagy rejected)
    $stmt = $pdo->prepare("UPDATE kapcsolatok SET statusz = ? WHERE id = ?");
    $stmt->execute([$data['status'], $data['id']]);

    $msg = $data['status'] === 'accepted' ? "Kapcsolat elfogadva!" : "Kapcsolat elutasítva.";
    echo json_encode(["message" => $msg]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Hiba: " . $e->getMessage()]);
}