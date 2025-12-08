<?php
$host = 'db';
$db   = 'mentormeet';       // <- Ez legyen az adatbázisod neve
$user = 'root';            // <- MySQL felhasználó
$pass = 'root';                // <- Jelszó, ha van
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Adatbázis hiba: ' . $e->getMessage()]);
    exit;
}
?>
