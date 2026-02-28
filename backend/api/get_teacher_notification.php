<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$teacher_id = $_GET['teacher_id'];

// Lekérjük a függőben lévő (aktiv=2) foglalásokat a diák nevével együtt
$sql = "SELECT i.id, i.datum, i.kezdes, u.nev as diak_neve 
        FROM idopontok i
        JOIN felhasznalok u ON i.diak_id = u.id
        WHERE i.tanar_id = ? AND i.aktiv = 2";

$stmt = $pdo->prepare($sql);
$stmt->execute([$teacher_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>