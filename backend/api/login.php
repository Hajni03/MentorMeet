<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$jelszo = $data['jelszo'] ?? '';

if (!$email || !$jelszo) {
    http_response_code(400);
    echo json_encode(['message' => 'Email és jelszó megadása kötelező.']);
    exit;
}

// Felhasználó keresése az email alapján
$stmt = $pdo->prepare("SELECT * FROM felhasznalok WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Jelszó ellenőrzése
if ($user && password_verify($jelszo, $user['jelszo'])) {
    // SIKERES BELÉPÉS
    // Biztonsági okokból a jelszót ne küldjük vissza!
    unset($user['jelszo']);
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Sikeres bejelentkezés.',
        'user' => $user
    ]);
} else {
    // SIKERTELEN BELÉPÉS
    http_response_code(401);
    echo json_encode(['message' => 'Hibás email cím vagy jelszó.']);
}
?>