<?php
//CORS:
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Adatbázis kapcsolat (példa, módosítsd a saját szerint)
$pdo = new PDO('mysql:host=localhost;dbname=mentormeet', 'root', 'root'); 
$pdo->exec("SET NAMES utf8");

// Lekérdezés
//$stmt = $pdo->query("SELECT id, nev FROM iskolak WHERE aktiv = 1");
$stmt = $pdo->query("SELECT * FROM iskolak");

$iskolak = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($iskolak);