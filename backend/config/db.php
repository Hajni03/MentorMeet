<?php
// Mivel Dockerben vagyunk, a host neve 'db', mert ez a service neve a compose-ban
$host = 'mysql.rackhost.hu'; 
$db   = 'c94046mentormeet'; // A compose-ban megadott MYSQL_DATABASE
$user = 'c94046mentormeet'; // A compose-ban megadott MYSQL_USER
$pass = 'mentormeet'; // A compose-ban megadott MYSQL_PASSWORD

$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Adatbázis hiba: ' . $e->getMessage()]);
    exit;
}
?>