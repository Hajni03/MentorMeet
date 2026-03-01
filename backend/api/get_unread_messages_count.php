<?php
// JAVÍTÁS: Az éles domainen a '*' vagy a konkrét https://mentormeet.hu kell!
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Pre-flight (OPTIONS) kérések kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

// Paraméter beolvasása
$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    try {
        // Lekérdezzük az olvasatlan üzenetek számát
        $sql = "SELECT COUNT(*) as unread_total FROM uzenetek WHERE fogado_id = :uid AND olvasott = 0";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['uid' => $user_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // JSON válasz küldése
        echo json_encode([
            "success" => true,
            "unread" => (int)($result['unread_total'] ?? 0)
        ]);

    } catch (PDOException $e) {
        // Hiba esetén 500-as kód, de ne szivárogtassunk DB infót élesben
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "unread" => 0, 
            "message" => "Adatbázis hiba történt."
        ]);
    }
} else {
    // Ha nincs user_id, 400-as hiba
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Hiányzó felhasználó azonosító."]);
}
?>