<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['tanar_id']) && !empty($data['tantargy_id'])) {
    try {
        $sql = "INSERT IGNORE INTO tanar_tantargy (tanar_id, tantargy_id) VALUES (:tid, :tsid)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'tid' => $data['tanar_id'],
            'tsid' => $data['tantargy_id']
        ]);
        echo json_encode(["message" => "Tantárgy hozzáadva!", "success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "DB hiba: " . $e->getMessage()]);
    }
}
?>