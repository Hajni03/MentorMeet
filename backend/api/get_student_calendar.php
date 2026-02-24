<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";

// Az Angular az 'user_id' paramétert küldi a konzol alapján
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó felhasználó azonosító!"]);
    exit;
}

try {
    // Összekapcsoljuk a foglalasok táblát az idopontok táblával
    // Így megkapjuk a dátumot, a kezdést és a befejezést is
    $sql = "SELECT 
                f.id, 
                f.statusz, 
                f.megjegyzes,
                i.datum, 
                i.kezdes, 
                i.befejezes,
                u.nev AS tanar_neve
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            JOIN felhasznalok u ON i.tanar_id = u.id
            WHERE f.diak_id = ?
            ORDER BY i.datum DESC, i.kezdes DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>