<?php
// ✅ JAVÍTÁS: Éles domain (biztonságosabb, mint a *)
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";

$tanar_id = $_GET['tanar_id'] ?? 0;

if ($tanar_id == 0) {
    echo json_encode([]); // Üres tömb jobb, mint a hibaüzenet a naptárnak
    exit;
}

try {
    // ✅ ISO formátum (T betűvel) a FullCalendar számára
    $sql = "SELECT id, datum, kezdes, befejezes, aktiv, diak_id,
            CONCAT(datum, 'T', kezdes) as idopont_start,
            CONCAT(datum, 'T', befejezes) as idopont_end
            FROM idopontok 
            WHERE tanar_id = :tid 
            ORDER BY datum ASC, kezdes ASC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['tid' => $tanar_id]);
    $schedule = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($schedule as &$slot) {
        if ($slot['aktiv'] == 0) {
            $slot['status_color'] = '#6c757d'; // Szürke (HEX kód biztosabb)
            $slot['title'] = 'Nem elérhető';
        } elseif (!empty($slot['diak_id'])) {
            $slot['status_color'] = '#dc3545'; // Piros (Foglalt)
            $slot['title'] = 'Foglalt';
        } else {
            $slot['status_color'] = '#28a745'; // Zöld (Szabad)
            $slot['title'] = 'Szabad időpont';
        }
    }

    echo json_encode($schedule);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Adatbázis hiba: " . $e->getMessage()]);
}