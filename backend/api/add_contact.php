<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$diak_id = $data['diak_id'] ?? null;
$tanar_id = $data['tanar_id'] ?? null;

if (!$diak_id || !$tanar_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Hiányzó azonosítók.']);
    exit;
}

try {
    // Ellenőrizzük, létezik-e már a kapcsolat
    $check = $pdo->prepare("SELECT id FROM kapcsolatok WHERE diak_id = ? AND tanar_id = ?");
    $check->execute([$diak_id, $tanar_id]);
    
    if ($check->fetch()) {
        echo json_encode(['message' => 'Már küldtél jelölést ennek a felhasználónak.']);
        exit;
    }

    // Új kapcsolat beszúrása
    $stmt = $pdo->prepare("INSERT INTO kapcsolatok (diak_id, tanar_id, statusz) VALUES (?, ?, 'pending')");
    $stmt->execute([$diak_id, $tanar_id]);

    echo json_encode(['message' => 'Jelölés sikeresen elküldve!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Adatbázis hiba: ' . $e->getMessage()]);
}
?>