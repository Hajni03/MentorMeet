<?php
// get_tanar_tantargyak.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$tanar_id = $_GET['tanar_id'] ?? 0;

try {
    // Az id lesz a tantárgy azonosítója, a nev a megjelenítéshez
    $sql = "SELECT t.id, t.nev 
            FROM tanar_tantargy tt
            JOIN tantargyak t ON tt.tantargy_id = t.id
            WHERE tt.tanar_id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$tanar_id]);
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($subjects);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>