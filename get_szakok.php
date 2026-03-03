<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$stmt = $pdo->query("SELECT * FROM szakok ORDER BY nev ASC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>