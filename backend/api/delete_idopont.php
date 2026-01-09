<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    $stmt = $pdo->prepare("DELETE FROM idopontok WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode(["message" => "Időpont törölve!"]);
}
?>