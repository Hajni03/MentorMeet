<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Az OPTIONS kérés kezelése a CORS miatt
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once "../config/db.php";

// A beérkező JSON adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['tanar_id']) && !empty($data['datum']) && !empty($data['kezdes']) && !empty($data['befejezes'])) {
    try {
        // SQL lekérdezés a te oszlopneveid alapján
        $sql = "INSERT INTO idopontok (tanar_id, datum, kezdes, befejezes, aktiv) 
                VALUES (:tid, :datum, :kezdes, :befejezes, 1)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'tid'       => $data['tanar_id'],
            'datum'     => $data['datum'],
            'kezdes'    => $data['kezdes'],
            'befejezes' => $data['befejezes']
        ]);

        echo json_encode(["message" => "Időpont sikeresen mentve!", "success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó adatok!"]);
}
?>