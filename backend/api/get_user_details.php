<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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