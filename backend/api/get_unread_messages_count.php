<?php
// Engedélyezzük a kérést az Angular portjáról (4200)
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Az Angular néha küld egy üres "preflight" kérést ellenőrzésképp
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once "../config/db.php";
$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    try {
        // A képed alapján: fogado_id és olvasott oszlopok
        // olvasott = 0 jelenti az olvasatlant
        $sql = "SELECT COUNT(*) as unread_total FROM uzenetek WHERE fogado_id = :uid AND olvasott = 0";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['uid' => $user_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(["unread" => (int)$result['unread_total']]);
    } catch (PDOException $e) {
        echo json_encode(["unread" => 0, "error" => $e->getMessage()]);
    }
}
?>