<?php
// Fejlécek a CORS és JSON válaszhoz
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Pre-flight kérések kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

// Adatok beolvasása az Angular kéréséből
$data = json_decode(file_get_contents("php://input"), true);

$felado_id = $data['sender_id'] ?? null;
$fogado_id = $data['receiver_id'] ?? null;
$tanar_id = $data['tanar_id'] ?? null;
$diak_id = $data['diak_id'] ?? null;

// Szigorú ellenőrzés: minden ID-nak meg kell lennie
if (!$felado_id || !$fogado_id || !$tanar_id || !$diak_id) {
    echo json_encode(["message" => "Hiányzó adatok a kérésben!"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Ellenőrizzük, létezik-e már bármilyen kapcsolat (akár elutasított, akár pending)
    $check = $pdo->prepare("SELECT id FROM kapcsolatok WHERE tanar_id = ? AND diak_id = ?");
    $check->execute([$tanar_id, $diak_id]);
    
    if ($check->rowCount() > 0) {
        $pdo->rollBack();
        echo json_encode(["message" => "Ezzel a felhasználóval már van folyamatban lévő kérése vagy kapcsolata."]);
        exit;
    }

    // 2. Kapcsolat beszúrása 'pending' státusszal
    $stmt = $pdo->prepare("INSERT INTO kapcsolatok (tanar_id, diak_id, statusz) VALUES (?, ?, 'pending')");
    $stmt->execute([$tanar_id, $diak_id]);
    
    // ✅ KRITIKUS: Ezt az ID-t várja az értesítések tábla 'slot_id' oszlopa!
    $uj_kapcsolat_id = $pdo->lastInsertId();

    // 3. Értesítés beszúrása a fogadó félnek
    $uzenet = "Új kapcsolatfelvételi kérelem érkezett!";
    
    // ✅ JAVÍTÁS: slot_id oszlopba mentjük a kapcsolat azonosítóját
    $sqlNoti = "INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, slot_id, olvasott, datum) 
                VALUES (?, ?, ?, 'jeloles', ?, 0, NOW())";
                
    $stmtNoti = $pdo->prepare($sqlNoti);
    $stmtNoti->execute([$fogado_id, $felado_id, $uzenet, $uj_kapcsolat_id]);

    $pdo->commit();
    echo json_encode([
        "success" => true,
        "message" => "Sikeres jelölés!",
        "kapcsolat_id" => $uj_kapcsolat_id
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) { $pdo->rollBack(); }
    http_response_code(500);
    echo json_encode(["message" => "Szerver hiba történt az adatbázis művelet során."]);
}
?>