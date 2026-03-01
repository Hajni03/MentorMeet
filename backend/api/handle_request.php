<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $kapcsolat_id = (int)$data['id'];
    $statusz = $data['status'];

    // 1. ELŐBB az értesítést tesszük olvasottá
    // Az ertesitesek táblában a kapcsolodo_id tárolja a kapcsolatok tábla ID-ját
    $stmtMarkRead = $pdo->prepare("
        UPDATE ertesitesek 
        SET olvasott = 1 
        WHERE tipus = 'jeloles' AND kapcsolodo_id = ?
    ");
    $stmtMarkRead->execute([$kapcsolat_id]);

    // 2. Frissítjük a kapcsolat státuszát
    $stmtUpdate = $pdo->prepare("UPDATE kapcsolatok SET statusz = ? WHERE id = ?");
    $stmtUpdate->execute([$statusz, $kapcsolat_id]);

    // 3. CSAK A VÉGÉN törlünk, ha elutasítás volt
    if ($statusz === 'rejected') {
        $stmtDelete = $pdo->prepare("DELETE FROM kapcsolatok WHERE id = ?");
        $stmtDelete->execute([$kapcsolat_id]);
    }

    $pdo->commit();
    
    $msg = ($statusz === 'accepted') ? "Kapcsolat elfogadva!" : "Kapcsolat elutasítva.";
    echo json_encode(["message" => $msg, "status" => $statusz]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["message" => "Szerver hiba: " . $e->getMessage()]);
}