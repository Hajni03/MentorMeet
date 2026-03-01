<?php
// Hibakeresés bekapcsolva (Fejlesztés alatt hasznos)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS és JSON fejlécek
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Pre-flight kérések kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Adatbázis kapcsolat
require_once "../config/db.php";

// Beérkező JSON adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$jelszo = $data['jelszo'] ?? '';

// Ellenőrzés, hogy minden adat megvan-e
if (!$email || !$jelszo) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email és jelszó megadása kötelező.'
    ]);
    exit;
}

try {
    // Felhasználó keresése az email alapján
    $stmt = $pdo->prepare("SELECT * FROM felhasznalok WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Jelszó ellenőrzése (password_hash-el mentett jelszóhoz)
    if ($user && password_verify($jelszo, $user['jelszo'])) {
        
        // Online státusz frissítése az adatbázisban
        $updateStmt = $pdo->prepare("UPDATE felhasznalok SET is_online = 1 WHERE id = ?");
        $updateStmt->execute([$user['id']]);
        
        // A válasz objektum előkészítése
        $user['is_online'] = 1;
        unset($user['jelszo']); // Biztonság: jelszó törlése a válaszból
        
        http_response_code(200);
        echo json_encode([
            'success' => true, // Az Angular AuthService-nek erre van szüksége!
            'message' => 'Sikeres bejelentkezés.',
            'user' => $user
        ]);

    } else {
        // Hibás adatok esetén
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Hibás email cím vagy jelszó.'
        ]);
    }

} catch (PDOException $e) {
    // Adatbázis hiba kezelése
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Adatbázis hiba történt.',
        'error' => $e->getMessage()
    ]);
}
?>