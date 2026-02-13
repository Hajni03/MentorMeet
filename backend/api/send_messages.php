<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// EZ HIÁNYZOTT: Az OPTIONS kérést azonnal le kell kezelni!
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['kuldo_id']) && !empty($data['fogado_id']) && !empty($data['szoveg'])) {
    $sql = "INSERT INTO uzenetek (kuldo_id, fogado_id, szoveg) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$data['kuldo_id'], $data['fogado_id'], $data['szoveg']])) {
        // Jó gyakorlat: állítsuk be a JSON fejlécet a válaszhoz is
        header('Content-Type: application/json');
        echo json_encode(["status" => "success"]);
    }
}
?>