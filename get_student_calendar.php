<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$diak_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($diak_id === 0) {
    echo json_encode([]);
    exit;
}

try {
    $sql = "SELECT 
                f.id as foglalas_id,
                f.statusz,
                i.datum, 
                i.kezdes, 
                i.befejezes,
                i.cim,
                u.nev AS tanar_neve,
                CONCAT(i.datum, 'T', i.kezdes) as start,
                CONCAT(i.datum, 'T', i.befejezes) as end,
                CASE 
                    WHEN f.statusz = 'accepted' THEN '#28a745' -- Zöld
                    WHEN f.statusz = 'rejected' THEN '#dc3545' -- Piros
                    ELSE '#ffc107' -- Sárga (pending)
                END as color
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            JOIN felhasznalok u ON i.tanar_id = u.id
            WHERE f.diak_id = ?
            ORDER BY i.datum ASC, i.kezdes ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$diak_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>