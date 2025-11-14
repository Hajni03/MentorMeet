<?php
$host = 'localhost';
$dbname = 'mentormeet';
$username = 'root';
$password = 'root'; // Mamp használata esetén

try {
    // Kapcsolat létrehozása
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Hibakezelés mód beállítása (kivétel dobása)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Sikeres adatbázis kapcsolat!";
} catch (PDOException $e) {
    echo "Hiba történt: " . $e->getMessage();
}
?>