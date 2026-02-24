<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// A tanár jelöli a diákot (vagy fordítva)
$felado_id = $data['tanar_id'] ?? null;
$fogado_id = $data['diak_id'] ?? null;

if (!$felado_id || !$fogado_id) {
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}
// Az INSERT rész az add_contact.php-ban:
$uzenet = "Új kapcsolat jelölés érkezett!";
$stmtNoti = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, olvasott) VALUES (?, ?, ?, 'jeloles', 0)");

if (!$stmtNoti->execute([$fogado_id, $felado_id, $uzenet])) {
    // Ha ide belép, akkor kiírja a pontos SQL hibát a konzolra
    echo json_encode(["message" => "SQL hiba az értesítésnél: " . implode(" ", $stmtNoti->errorInfo())]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Megnézzük, létezik-e már ilyen kapcsolat
    $check = $pdo->prepare("SELECT id FROM kapcsolatok WHERE (tanar_id = ? AND diak_id = ?) OR (tanar_id = ? AND diak_id = ?)");
    $check->execute([$felado_id, $fogado_id, $fogado_id, $felado_id]);
    
    if ($check->rowCount() > 0) {
        echo json_encode(["message" => "Már küldtél jelölést, vagy már ismerősök vagytok."]);
        $pdo->rollBack();
        exit;
    }

    // 2. Kapcsolat beszúrása 'pending' státusszal
    $stmt = $pdo->prepare("INSERT INTO kapcsolatok (tanar_id, diak_id, statusz) VALUES (?, ?, 'pending')");
    $stmt->execute([$felado_id, $fogado_id]);

    // 3. ÉRTESÍTÉS LÉTREHOZÁSA - Most már elmentjük a felado_id-t is!
    // Feltételezve, hogy hozzáadtad a felado_id oszlopot a táblához
    $uzenet = "Új kapcsolat jelölés érkezett!";
    $stmtNoti = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, olvasott) VALUES (?, ?, ?, 'jeloles', 0)");
    $stmtNoti->execute([$fogado_id, $felado_id, $uzenet]);

    $pdo->commit();
    echo json_encode(["message" => "Jelölés sikeresen elküldve!"]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["message" => "Hiba: " . $e->getMessage()]);
}