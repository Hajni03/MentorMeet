<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// ✅ Adatok beolvasása (Angular rugalmasság)
$kapcsolat_id = $data['id'] ?? $data['kapcsolodo_id'] ?? null;
$uj_statusz = $data['status'] ?? $data['action'] ?? null;

if (!$kapcsolat_id || !$uj_statusz) {
    echo json_encode([
        "message" => "Hiányzó adatok!",
        "debug_received" => $data 
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Frissítjük a kapcsolat státuszát
    // JAVÍTÁS: -> használata . helyett
    $stmtUpdate = $pdo->prepare("UPDATE kapcsolatok SET statusz = ? WHERE id = ?");
    $stmtUpdate->execute([$uj_statusz, $kapcsolat_id]);

    // 2. Az értesítést olvasottá tesszük (slot_id alapján)
    $stmtMarkRead = $pdo->prepare("UPDATE ertesitesek SET olvasott = 1 WHERE tipus = 'jeloles' AND slot_id = ?");
    $stmtMarkRead->execute([$kapcsolat_id]);

    $pdo->commit();
    
    echo json_encode([
        "success" => true,
        "message" => "Sikeres mentés!", 
        "status" => $uj_statusz
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["message" => "Szerver hiba: " . $e->getMessage()]);
}