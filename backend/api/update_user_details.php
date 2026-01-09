<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    try {
        // Egyszerre frissítünk minden új mezőt a felhasznalok táblában
        $sql = "UPDATE felhasznalok SET 
                telefonszam = :tel, 
                szuletes_datum = :szul, 
                bemutatkozas = :bio 
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([
            'tel' => $data['telefonszam'] ?? null,
            'szul' => $data['szuletes_datum'] ?? null,
            'bio' => $data['bemutatkozas'] ?? null,
            'id' => $data['id']
        ]);
        
        echo json_encode(["message" => "Profil sikeresen frissítve!", "success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Hiányzó felhasználó ID!"]);
}
?>