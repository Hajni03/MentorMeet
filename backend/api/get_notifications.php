<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include __DIR__ . "/../config/db.php";

// Az Angular 'tanar_id' paraméterként küldi
$felhasznalo_id = $_GET['tanar_id'] ?? 0;

try {
    // JAVÍTÁS: LEFT JOIN a foglalasok táblával, hogy lássuk a státuszt (accepted/pending/rejected)
    $sql = "SELECT 
                e.*, 
                f.nev AS felado_neve,
                fogl.statusz AS statusz 
            FROM ertesitesek e
            LEFT JOIN felhasznalok f ON e.felado_id = f.id
            LEFT JOIN foglalasok fogl ON e.slot_id = fogl.idopont_id
            WHERE e.felhasznalo_id = :fid 
            ORDER BY e.datum DESC 
            LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fid' => $felhasznalo_id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Visszaküldjük az adatokat, amiben már benne van a 'statusz' is
    echo json_encode($result);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>