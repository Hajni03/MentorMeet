<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
include __DIR__ . '/../config/db.php';

$user_id = $_GET['felhasznalo_id'] ?? 0;
$iskola_id = $_GET['iskola_id'] ?? 0;

try {
    // 1. Ugyanabba az iskolába járnak
    // 2. Szerepük 'diak'
    // 3. Még nincsenek benne a kapcsolatok táblában ezzel a tanárral
    $sql = "SELECT id, nev, email, profilkep_eleres, szerep 
            FROM felhasznalok 
            WHERE iskola_id = :iid 
            AND szerep = 'diak' 
            AND id NOT IN (
                SELECT diak_id FROM kapcsolatok WHERE tanar_id = :uid
            )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['iid' => $iskola_id, 'uid' => $user_id]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($students);

} catch (PDOException $e) {
    http_response_code(500);
    // Fejlesztés alatt hagyd bent az error üzenetet, élesben majd vedd ki!
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}