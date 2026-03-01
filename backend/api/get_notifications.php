<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

include __DIR__ . "/../config/db.php";

$uid = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if ($uid === 0) { echo json_encode([]); exit; }

try {
    // ... SQL lekérdezés része ...
$sql = "SELECT 
            e.*, 
            f.nev AS felado_neve,
            -- ✅ JAVÍTÁS: slot_id-t használunk kapcsolodo_id helyett
            e.slot_id AS kapcsolodo_id,
            CASE 
                WHEN e.tipus = 'jeloles' THEN (SELECT statusz FROM kapcsolatok WHERE id = e.slot_id LIMIT 1)
                WHEN e.tipus = 'booking' THEN (SELECT statusz FROM foglalasok WHERE idopont_id = e.slot_id ORDER BY id DESC LIMIT 1)
                ELSE NULL 
            END as kapcsolat_statusz
        FROM ertesitesek e
        LEFT JOIN felhasznalok f ON e.felado_id = f.id
        WHERE e.felhasznalo_id = :fid 
        ORDER BY e.datum DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fid' => $uid]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notifications);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba."]);
}
?>