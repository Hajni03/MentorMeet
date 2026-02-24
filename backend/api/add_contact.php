<?php
// Fejlécek a legtetején, hogy a böngésző mindenképp megkapja őket
header("Access-Control-Allow-Origin: http://localhost:4200"); // Konkrétan az Angular portja
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Relatív útvonal javítása a korábban megbeszéltek szerint
require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$diak_id = $data['diak_id'] ?? null;
$tanar_id = $data['tanar_id'] ?? null;

if (!$diak_id || !$tanar_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Hiányzó azonosítók.']);
    exit;
}

try {
    // 1. Ellenőrzés
    $check = $pdo->prepare("SELECT id FROM kapcsolatok WHERE diak_id = ? AND tanar_id = ?");
    $check->execute([$diak_id, $tanar_id]);
    
    if ($check->fetch()) {
        echo json_encode(['message' => 'Már küldtél jelölést ennek a felhasználónak.']);
        exit;
    }

    // 2. Kapcsolat beszúrása
    $stmt = $pdo->prepare("INSERT INTO kapcsolatok (diak_id, tanar_id, statusz) VALUES (?, ?, 'pending')");
    $stmt->execute([$diak_id, $tanar_id]);

    // --- ÚJ: ÉRTESÍTÉS LÉTREHOZÁSA ---
    // Lekérjük a tanár nevét az üzenethez
    $t_stmt = $pdo->prepare("SELECT nev FROM felhasznalok WHERE id = ?");
    $t_stmt->execute([$tanar_id]);
    $tanar = $t_stmt->fetch(PDO::FETCH_ASSOC);
    $tanar_neve = $tanar['nev'] ?? 'Egy tanár';

    // Beszúrjuk a diák értesítő táblájába a kép alapján: felhasznalo_id, uzenet, tipus, olvasott, datum
    $n_stmt = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, uzenet, tipus, olvasott, datum) 
                             VALUES (?, ?, 'jeloles', 0, NOW())");
    $uzenet = $tanar_neve . " ismerősnek jelölt téged.";
    $n_stmt->execute([$diak_id, $uzenet]);
    // --- ÚJ RÉSZ VÉGE ---

    echo json_encode(['message' => 'Jelölés sikeresen elküldve!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Adatbázis hiba: ' . $e->getMessage()]);
}
?>