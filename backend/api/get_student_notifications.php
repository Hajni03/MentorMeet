<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// A bejelentkezett diák azonosítója kell
$diak_id = $_GET['diak_id'] ?? null;

if (!$diak_id) {
    echo json_encode(["message" => "Nincs megadva diák ID"]);
    exit;
}

try {
    // Itt azokat keressük, amiket a tanár ELFOGADOTT (statusz = 'accepted')
    // A JOIN segítségével lekérjük a tanár nevét is az értesítéshez
    $sql = "SELECT k.id as request_id, f.nev as tanar_neve, k.statusz 
            FROM kapcsolatok k
            JOIN felhasznalok f ON k.tanar_id = f.id
            WHERE k.diak_id = :diak_id AND k.statusz = 'accepted'";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['diak_id' => $diak_id]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($res);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>