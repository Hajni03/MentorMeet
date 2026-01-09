<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// Fontos: tanar_id és tantargy_id alapján törlünk
if (!empty($data['tanar_id']) && !empty($data['tantargy_id'])) {
    try {
        $sql = "DELETE FROM tanar_tantargy 
                WHERE tanar_id = :tid AND tantargy_id = :tsid";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'tid' => $data['tanar_id'],
            'tsid' => $data['tantargy_id']
        ]);
        
        echo json_encode(["message" => "Tantárgy sikeresen eltávolítva!", "success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Hiba a törlés során: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Hiányzó adatok a törléshez!"]);
}
?>