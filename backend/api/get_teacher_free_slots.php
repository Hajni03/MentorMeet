<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

$teacher_id = $_GET['teacher_id'] ?? null;

if ($teacher_id) {
    try {
        // A te táblád oszlopai: id, tanar_id, diak_id, datum, kezdes, befejezes, aktiv
        // Akkor szabad egy időpont, ha nincs még diák_id (NULL) és az aktiv = 1
        $sql = "SELECT 
                    id, 
                    datum, 
                    kezdes, 
                    befejezes,
                    CONCAT(datum, ' ', kezdes) as idopont_start,
                    CONCAT(datum, ' ', befejezes) as idopont_end
                FROM idopontok 
                WHERE tanar_id = :tid 
                AND diak_id IS NULL 
                AND aktiv = 1 
                AND datum >= CURDATE()
                ORDER BY datum ASC, kezdes ASC";

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