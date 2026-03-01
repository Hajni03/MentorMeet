<?php
// ✅ JAVÍTÁS: Éles domain engedélyezése
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "../config/db.php";

$teacher_id = $_GET['teacher_id'] ?? null;

if ($teacher_id) {
    try {
        $sql = "SELECT id, datum, kezdes, befejezes, diak_id,
        CONCAT(datum, 'T', kezdes) as idopont_start,
        CONCAT(datum, 'T', befejezes) as idopont_end
        FROM idopontok 
        WHERE tanar_id = :tid AND aktiv = 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['tid' => $teacher_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($results);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode([]);
}
?>