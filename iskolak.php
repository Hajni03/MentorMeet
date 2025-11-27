<?php
header('Content-Type: application/json');

// Adatbázis kapcsolat (példa, módosítsd a saját szerint)
$pdo = new PDO('mysql:host=localhost;dbname=mentormeet', 'root', 'root'); // ha van jelszó, írd be
$pdo->exec("SET NAMES utf8");

// Lekérdezés
$stmt = $pdo->query("SELECT id, nev FROM iskolak WHERE aktiv = 1");

$iskolak = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($iskolak);
