<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// A __DIR__ biztosítja, hogy a PHP kilépjen az api mappából a config-ba
include __DIR__ . "/../config/db.php";

$id = $_GET['id'] ?? 0;

try {
    // Válogasd le azokat a mezőket, amiket meg akarsz mutatni
    $stmt = $pdo->prepare("SELECT nev, szerep, email, iskola_id FROM felhasznalok WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Felhasználó nem található"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}