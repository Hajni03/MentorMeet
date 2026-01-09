<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php"; 

$user_id = $_GET['user_id'] ?? 0;

try {
    // 1. Megnézzük a bejelentkezett felhasználó szerepét
    $userStmt = $pdo->prepare("SELECT szerep FROM felhasznalok WHERE id = ?");
    $userStmt->execute([$user_id]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);
    $my_role = $user['szerep'] ?? '';

    // 2. Ha Tanár vagy, azokat a Diákokat keressük, akik bejelöltek téged
    if ($my_role === 'tanar') {
        $sql = "SELECT k.id as request_id, f.id as sender_id, f.nev, f.szerep 
                FROM kapcsolatok k
                JOIN felhasznalok f ON k.diak_id = f.id
                WHERE k.tanar_id = :uid 
                AND k.statusz = 'pending'";
    } 
    // 3. Ha Diák vagy, azokat a Tanárokat keressük, akik bejelöltek téged
    else {
        $sql = "SELECT k.id as request_id, f.id as sender_id, f.nev, f.szerep 
                FROM kapcsolatok k
                JOIN felhasznalok f ON k.tanar_id = f.id
                WHERE k.diak_id = :uid 
                AND k.statusz = 'pending'";
    }
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['uid' => $user_id]);

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($requests);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Hiba: " . $e->getMessage()]);
}