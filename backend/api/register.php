<?php
//CORS:
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once "../config/db.php";

// Bejövő JSON feldolgozása
$data = json_decode(file_get_contents("php://input"), true);

$nev = $data['nev'] ?? '';
$email = $data['email'] ?? '';
$jelszo = $data['jelszo'] ?? '';
$szerep = $data['szerep'] ?? '';
$iskola_id = $data['iskola_id'] ?? null;
$osztaly_id = $data['osztaly_id'] ?? null;

if (!$nev || !$email || !$jelszo || !$szerep || !$iskola_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Hiányzó kötelező mezők.']);
    exit;
}

// Ellenőrizd, hogy email már létezik-e
$stmt = $pdo->prepare("SELECT id FROM felhasznalok WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(['message' => 'Ez az email már foglalt.']);
    exit;
}

// Jelszó hashelés
$hashedPassword = password_hash($jelszo, PASSWORD_BCRYPT);

// Beszúrás
$stmt = $pdo->prepare("INSERT INTO felhasznalok (nev, email, jelszo, szerep, iskola_id, osztaly_id, letrehozva)
                       VALUES (?, ?, ?, ?, ?, ?, NOW())");

try {
    $stmt->execute([$nev, $email, $hashedPassword, $szerep, $iskola_id, $osztaly_id]);
    http_response_code(201);
    echo json_encode(['message' => 'Sikeres regisztráció.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Hiba a regisztráció során.', 'error' => $e->getMessage()]);
}
?>
