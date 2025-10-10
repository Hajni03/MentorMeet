<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? '';
    $email = $_POST["email"] ?? '';
    $password = $_POST["password"] ?? '';
    $repassword = $_POST["repassword"] ?? '';

    // Jelszó ellenőrzése
    if ($password !== $repassword) {
        echo "A jelszavak nem egyeznek!";
        exit;
    }
    // Itt jönne az adatbázisba való mentés logikája
    echo "Sikeres regisztráció, üdvözlünk, $name!";
    // Jelszó hashelése
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
} else {
    echo "Hibás kérés!";
}
/*
Ez egy régebbi verzióból való, egyáltalán nem mérvadó, szimplán csak arra kell hogy lássam mik voltak
Ez egy régebbi verzióból való, egyáltalán nem mérvadó, szimplán csak arra kell hogy lássam mik voltak
Ez egy régebbi verzióból való, egyáltalán nem mérvadó, szimplán csak arra kell hogy lássam mik voltak



// Függvény kód generálására
function generalKod($elsoBetu)
{
    $karakterek = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Karakterek halmaza
    $kod = $elsoBetu; // Kód kezdőbetűje
    for ($i = 0; $i < 7; $i++) {
        $kod .= $karakterek[random_int(0, strlen($karakterek) - 1)]; // Véletlenszerű karakter hozzáadása
    }
    return $kod;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["role"])) {
        $role = $_POST["role"];
        if ($role === "student") {
            $kod = generalKod("S");
            echo "<p>Te a <strong>Diák</strong> szerepet választottad.<br>Kódod: <strong>$kod</strong></p>";
        } elseif ($role === "teacher") {
            $kod = generalKod("T");
            echo "<p>Te a <strong>Tanár</strong> szerepet választottad.<br>Kódod: <strong>$kod</strong></p>";
        }
    } else {
        echo "<p>Nem választottál semmit!</p>";
    }
}
*/
?>