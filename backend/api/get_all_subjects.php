<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

try {
    // Ellenőrizd a táblanevet és az oszlopokat a képed alapján!
    $sql = "SELECT id, nev FROM tantargyak ORDER BY nev ASC";
    $stmt = $pdo->query($sql);
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($subjects);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Hiba: " . $e->getMessage()]);
}
?>