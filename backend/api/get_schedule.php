<?php
// CORS beállítások - ezek nélkül az Angular nem tud beszélni a PHP-val!
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Hibakeresés bekapcsolása (csak tesztelés idejére!)
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../config/db.php";

$tanar_id = $_GET['tanar_id'] ?? 0;

if ($tanar_id == 0) {
    echo json_encode(["error" => "Nincs tanar_id megadva"]);
    exit;
}

try {
    // Csak a te táblád oszlopait használjuk: id, datum, kezdes, befejezes, aktiv, diak_id
    $sql = "SELECT id, datum, kezdes, befejezes, aktiv, diak_id 
            FROM idopontok 
            WHERE tanar_id = :tid 
            ORDER BY datum ASC, kezdes ASC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['tid' => $tanar_id]);
    $schedule = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($schedule as &$slot) {
        if ($slot['aktiv'] == 0) {
            $slot['status_color'] = 'gray';  // Nem elérhető
        } elseif (!empty($slot['diak_id'])) {
            $slot['status_color'] = 'red';   // Foglalt
        } else {
            $slot['status_color'] = 'green'; // Szabad
        }
    }

    echo json_encode($schedule);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>