<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$tanar_id = $_GET['tanar_id'] ?? 0;

try {
    // JOIN-t használunk, hogy a tantargyak táblából megkapjuk a nevet is
    // A tantargy_id-t 'id' néven adjuk át az Angularnak a könnyebb kezelhetőségért
    $sql = "SELECT tt.tantargy_id AS id, t.nev AS tantargy_nev 
            FROM tanar_tantargy tt
            JOIN tantargyak t ON tt.tantargy_id = t.id 
            WHERE tt.tanar_id = :tid";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['tid' => $tanar_id]);
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
}
?>