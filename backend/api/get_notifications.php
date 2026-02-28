<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include __DIR__ . "/../config/db.php";

$felhasznalo_id = $_GET['tanar_id'] ?? 0;

try {
    // JOIN a felhasznalok táblával a felado_id alapján
    $sql = "SELECT e.*, f.nev AS felado_neve 
            FROM ertesitesek e
            LEFT JOIN felhasznalok f ON e.felado_id = f.id
            WHERE e.felhasznalo_id = :fid 
            ORDER BY e.datum DESC 
            LIMIT 10";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fid' => $felhasznalo_id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>