<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Ha OPTIONS kérés érkezik (preflight), azonnal lépjünk ki sikerrel
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include __DIR__ . "/../config/db.php";

$id = $_GET['id'] ?? 0;

try {
    // MÓDOSÍTOTT LEKÉRDEZÉS: JOIN-oljuk az iskolak táblát
    $query = "SELECT f.id, f.nev, f.szerep, f.email, f.iskola_id, i.nev AS iskola_nev 
              FROM felhasznalok f 
              LEFT JOIN iskolak i ON f.iskola_id = i.id 
              WHERE f.id = ?";
              
    $stmt = $pdo->prepare($query);
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
?>