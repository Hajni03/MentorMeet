<?php
// ✅ JAVÍTÁS: Éles domain engedélyezése a localhost helyett
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . "/../config/db.php";

// ✅ JAVÍTÁS: Kényszerítsük számmá az ID-t
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id === 0) {
    echo json_encode(["error" => "Érvénytelen azonosító"]);
    exit;
}

try {
    // Itt lekérjük a profil alapadatait és az iskola nevét is
    $query = "SELECT f.id, f.nev, f.szerep, f.email, f.iskola_id, f.profilkep_eleres, i.nev AS iskola_nev 
              FROM felhasznalok f 
              LEFT JOIN iskolak i ON f.iskola_id = i.id 
              WHERE f.id = ?";
              
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // ✅ JAVÍTÁS: Ha nincs profilkép, adjunk egy alapértelmezettet a frontenden való hibák elkerülésére
        if (!$user['profilkep_eleres']) {
            $user['profilkep_eleres'] = 'assets/images/profilkep_placeholder.jpg';
        }
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Felhasználó nem található"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    // Éles környezetben jobb nem kiírni a pontos SQL hibát, de most a hiba kereséséhez maradhat
    echo json_encode(["error" => "Adatbázis hiba történt."]);
}
?>