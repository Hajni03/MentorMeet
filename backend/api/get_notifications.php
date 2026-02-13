<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include "config.php";

$felhasznalo_id = $_GET['tanar_id'];

// A te oszlopaidat használjuk: uzenet, is_read, created_at
$sql = "SELECT id, uzenet, is_read, created_at 
        FROM ertesitesek 
        WHERE felhasznalo_id = :fid 
        ORDER BY created_at DESC 
        LIMIT 10";

$stmt = $pdo->prepare($sql);
$stmt->execute(['fid' => $felhasznalo_id]);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);
?>