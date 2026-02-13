<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['user_id'])) {
    $sql = "UPDATE felhasznalok SET utolso_gepeles = NOW(), gepel_szamara = :target 
            WHERE id = :uid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['uid' => $data['user_id'], 'target' => $data['target_id']]);
}
?>