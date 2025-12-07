<?php
// 👇 Hibák kiírása fejlesztéshez
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB kapcsolódás - helyes útvonal!
require_once __DIR__ . '/../config/db.php';

// Ellenőrzés, hogy van-e GET paraméter
if (!isset($_GET['iskola_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Hiányzó iskola_id paraméter."]);
    exit;
}

$iskola_id = intval($_GET['iskola_id']);

try {
    // PDO előkészített lekérdezés
    $stmt = $pdo->prepare("SELECT id, nev FROM osztalyok WHERE iskola_id = ?");
    $stmt->execute([$iskola_id]);

    $osztalyok = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($osztalyok);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>
