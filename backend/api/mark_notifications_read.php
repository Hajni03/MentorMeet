<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/db.php";

// A felhasználó ID-ját GET paraméterként várjuk az Angulartól
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if ($user_id) {
    try {
        // Frissítjük az összes olvasatlan értesítést olvasottra (is_read = 1) az új táblában
        $sql = "UPDATE ertesitesek SET is_read = 1 WHERE felhasznalo_id = :uid AND is_read = 0";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['uid' => $user_id]);

        echo json_encode([
            "success" => true, 
            "message" => "Értesítések olvasottnak jelölve.",
            "updated_count" => $stmt->rowCount()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Hiányzó felhasználó azonosító!"]);
}
?>