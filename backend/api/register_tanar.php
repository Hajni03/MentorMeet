<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

// Bejövő JSON feldolgozása
$data = json_encode(file_get_contents("php://input"), true);
$data = json_decode(file_get_contents("php://input"), true);

$nev = $data['nev'] ?? '';
$email = $data['email'] ?? '';
$jelszo = $data['jelszo'] ?? '';
// 👇 Fix szerepkör a tanároknak
$szerep = 'tanar'; 
$iskola_id = $data['iskola_id'] ?? null;

// Tanárnál az osztaly_id nem kötelező, ezért kivettem az ellenőrzésből
if (!$nev || !$email || !$jelszo || !$iskola_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Hiányzó kötelező mezők (Név, Email, Jelszó vagy Iskola).']);
    exit;
}

// Email ellenőrzés
$stmt = $pdo->prepare("SELECT id FROM felhasznalok WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(['message' => 'Ez az email már foglalt.']);
    exit;
}

$hashedPassword = password_hash($jelszo, PASSWORD_BCRYPT);

// Az INSERT marad ugyanaz, de az osztaly_id itt null lesz, ha nem küldik el
$stmt = $pdo->prepare("INSERT INTO felhasznalok (nev, email, jelszo, szerep, iskola_id, osztaly_id, letrehozva)
                       VALUES (?, ?, ?, ?, ?, ?, NOW())");

try {
    // Ha a tanárnak nincs osztálya, az $data['osztaly_id'] null marad
    $osztaly_id = $data['osztaly_id'] ?? null;
    
    $stmt->execute([$nev, $email, $hashedPassword, $szerep, $iskola_id, $osztaly_id]);
    http_response_code(201);
    echo json_encode(['message' => 'Sikeres tanár regisztráció.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Hiba a szerveroldali mentés során.', 'error' => $e->getMessage()]);
}
?>