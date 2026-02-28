<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

$diak_id = $_GET['user_id']; // Az Angularból érkező ID

if (!$diak_id) {
    echo json_encode([]);
    exit;
}

try {
    // Lekérjük a foglalásokat az időpont adatokkal és a tanár nevével együtt
    $sql = "SELECT 
                f.id as foglalas_id,
                f.statusz, 
                i.datum, 
                i.kezdes, 
                i.befejezes,
                u.nev AS tanar_neve,
                -- A naptárnak (FullCalendar) kellenek ezek a formátumok:
                CONCAT(i.datum, 'T', i.kezdes) as start,
                CONCAT(i.datum, 'T', i.befejezes) as end
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            JOIN felhasznalok u ON i.tanar_id = u.id
            WHERE f.diak_id = ?
            ORDER BY i.datum ASC, i.kezdes ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$diak_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}