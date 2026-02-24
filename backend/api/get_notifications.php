<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// A __DIR__ biztosítja, hogy a PHP kilépjen az api mappából a config-ba
include __DIR__ . "/../config/db.php";

// Az Angularból érkező ID (amit a felhasznalo_id-val hasonlítunk össze)
$felhasznalo_id = $_GET['tanar_id'] ?? 0;

try {
    // Pontosan a te oszlopaidat használjuk a kép alapján:
    // id, felhasznalo_id, uzenet, tipus, olvasott, datum
    $sql = "SELECT id, uzenet, tipus, olvasott, datum 
            FROM ertesitesek 
            WHERE felhasznalo_id = :fid 
            ORDER BY datum DESC 
            LIMIT 10";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fid' => $felhasznalo_id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ha nincs hiba, tiszta JSON-t küldünk vissza
    echo json_encode($result);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>