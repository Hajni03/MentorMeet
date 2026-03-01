<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// Ki az, aki a gombra kattintott (feladó) és kit jelölt (fogadó)
$felado_id = $data['sender_id'] ?? null;
$fogado_id = $data['receiver_id'] ?? null;

// Szerepkör szerinti ID-k a kapcsolatok táblához (ezek kellenek az adatbázisod sémája miatt)
$tanar_id = $data['tanar_id'] ?? null;
$diak_id = $data['diak_id'] ?? null;

if (!$felado_id || !$fogado_id) {
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Ellenőrizzük, van-e már kérelem
    $check = $pdo->prepare("SELECT id FROM kapcsolatok WHERE tanar_id = ? AND diak_id = ?");
    $check->execute([$tanar_id, $diak_id]);
    
    if ($check->rowCount() > 0) {
        $pdo->rollBack();
        echo json_encode(["message" => "Már küldtél jelölést, vagy már ismerősök vagytok."]);
        exit;
    }

    // 2. Kapcsolat beszúrása
    $stmt = $pdo->prepare("INSERT INTO kapcsolatok (tanar_id, diak_id, statusz) VALUES (?, ?, 'pending')");
    $stmt->execute([$tanar_id, $diak_id]);

    // 3. Értesítés beszúrása - A FOGADÓNAK (felhasznalo_id) küldjük!
    $uzenet = "Új kapcsolatfelvételi kérelem érkezett!";
    $stmtNoti = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, olvasott) VALUES (?, ?, ?, 'jeloles', 0)");
    $stmtNoti->execute([$fogado_id, $felado_id, $uzenet]);

    $pdo->commit();
    echo json_encode(["message" => "Sikeres jelölés!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) { $pdo->rollBack(); }
    http_response_code(500);
    echo json_encode(["message" => "Szerver hiba: " . $e->getMessage()]);
}