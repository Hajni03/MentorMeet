<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$user_id = $_GET['id'] ?? 0;
if ($user_id) {
    $stmt = $pdo->prepare("UPDATE felhasznalok SET is_online = 0 WHERE id = :id");
    $stmt->execute(['id' => $user_id]);
    echo json_encode(["status" => "success"]);
}