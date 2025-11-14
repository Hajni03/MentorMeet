<?php
require_once 'database_connection.php'; // Adatbázis kapcsolat betöltése

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $password = $_POST["password"] ?? '';
    $repassword = $_POST["repassword"] ?? '';

    // Üres mezők ellenőrzése
    if (empty($name) || empty($email) || empty($password) || empty($repassword)) {
        die("Kérlek, tölts ki minden mezőt!");
    }

    // Jelszavak egyezésének ellenőrzése
    if ($password !== $repassword) {
        die("A két jelszó nem egyezik!");
    }

    // Email ellenőrzés (szintaktikailag helyes-e)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Érvénytelen email cím!");
    }

    // Jelszó titkosítása
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Ellenőrizzük, hogy az email már létezik-e
        $checkStmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $checkStmt->execute([$email]);

        if ($checkStmt->rowCount() > 0) {
            die("Ez az email cím már regisztrálva van!");
        }

        // Adatok beszúrása az adatbázisba
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hashedPassword]);

        echo "Sikeres regisztráció, üdvözlünk, $name!";
    } catch (PDOException $e) {
        die("Hiba történt a mentés során: " . $e->getMessage());
    }
}

?>