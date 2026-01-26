<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$user_id = $_GET['user_id'] ?? 0;

try {
    // Kifejezetten a Te táblád oszlopneveit használjuk
    $sql = "SELECT 
                f.id, 
                f.nev, 
                f.szerep, 
                f.email,
                f.profilkep_eleres,
                f.is_online
            FROM kapcsolatok k
            JOIN felhasznalok f ON (
                (k.tanar_id = f.id AND k.diak_id = :uid) OR 
                (k.diak_id = f.id AND k.tanar_id = :uid)
            )
            WHERE k.statusz = 'accepted' 
            AND (k.tanar_id = :uid OR k.diak_id = :uid)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['uid' => $user_id]);
    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($friends);

} catch (PDOException $e) {
    // Ha hiba van, ezt fogod látni a Network fülön a Response-ban
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>