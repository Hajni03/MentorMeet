<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id']) && !empty($data['kezdes']) && !empty($data['befejezes'])) {
    try {
        $sql = "UPDATE idopontok 
                SET cim = :cim, 
                    kezdes = :kezdes, 
                    befejezes = :befejezes 
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            'cim' => $data['cim'] ?? '',
            'kezdes' => $data['kezdes'],
            'befejezes' => $data['befejezes'],
            'id' => $data['id']
        ]);

        echo json_encode(["success" => true, "message" => "Időpont frissítve!"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó adatok!"]);
}
?>