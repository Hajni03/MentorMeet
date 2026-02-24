<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Megkeressük az értesítést (itt csak felhasznalo_id van az image_9671cb alapján)
    $stmtNoti = $pdo->prepare("SELECT felhasznalo_id FROM ertesitesek WHERE id = ?");
    $stmtNoti->execute([$data['id']]);
    $noti = $stmtNoti->fetch();

    if ($noti) {
        // 2. Mivel nincs felado_id-nk az értesítésben, megkeressük a hozzá tartozó 'pending' kapcsolatot
        // Feltételezzük, hogy a diák (felhasznalo_id) kapta a kérést
        $stmtUpdate = $pdo->prepare("
            UPDATE kapcsolatok 
            SET statusz = ? 
            WHERE diak_id = ? AND statusz = 'pending'
            LIMIT 1
        ");
        $stmtUpdate->execute([$data['status'], $noti['felhasznalo_id']]);

        // 3. Értesítés olvasottá tétele (image_9671cb oszlopneveivel)
        $stmtMarkRead = $pdo->prepare("UPDATE ertesitesek SET olvasott = 1 WHERE id = ?");
        $stmtMarkRead->execute([$data['id']]);

        $pdo->commit();
        echo json_encode(["message" => "Sikeresen frissítve: " . $data['status']]);
    } else {
        $pdo->rollBack();
        echo json_encode(["message" => "Hiba: Az értesítés (ID: ".$data['id'].") nem található!"]);
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["message" => "SQL hiba: " . $e->getMessage()]);
}