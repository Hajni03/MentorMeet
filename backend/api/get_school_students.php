<?php
include 'db.php';

$user_id = $_GET['user_id'] ?? 0;
$iskola_id = $_GET['iskola_id'] ?? 0;

try {
    // Csak DIÁKOKAT keresünk, akik:
    // 1. Ugyanabba az iskolába járnak
    // 2. Még nincsenek kapcsolatban ezzel a tanárral
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
    echo json_encode(["error" => $e->getMessage()]);
}