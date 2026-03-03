<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . "/../config/db.php";

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id === 0) {
    echo json_encode(["error" => "Érvénytelen azonosító"]);
    exit;
}

try {
    // ✅ JAVÍTÁS: A lekérdezésnél kezeljük, ha az ID 0 vagy NULL
    $query = "SELECT 
                f.id, 
                f.nev, 
                f.szerep, 
                f.email, 
                f.iskola_id, 
                f.szak_id,
                f.bemutatkozas,
                f.profilkep_eleres, 
                IFNULL(i.nev, 'Nincs megadva intézmény') AS iskola_nev,
                IFNULL(sz.nev, 'Nincs megadva szak') AS szak_nev
              FROM felhasznalok f 
              LEFT JOIN iskolak i ON f.iskola_id = i.id AND f.iskola_id > 0
              LEFT JOIN szakok sz ON f.szak_id = sz.id AND f.szak_id > 0
              WHERE f.id = ?";
              
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // ✅ JAVÍTÁS: Útvonal ellenőrzés
        if (empty($user['profilkep_eleres'])) {
            $user['profilkep_eleres'] = 'assets/images/profilkep_placeholder.jpg';
        }

        // Biztosítjuk a típusokat az Angularnak
        $user['id'] = (int)$user['id'];
        $user['iskola_id'] = $user['iskola_id'] ? (int)$user['iskola_id'] : null;
        $user['szak_id'] = $user['szak_id'] ? (int)$user['szak_id'] : null;

        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Felhasználó nem található a PHP-ban (ID: $id)"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL hiba", "details" => $e->getMessage()]);
}
?>