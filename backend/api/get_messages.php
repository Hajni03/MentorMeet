<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

require_once "../config/db.php";

$bejelentkezett_id = $_GET['kuldo_id'] ?? 0;
$partner_id = $_GET['fogado_id'] ?? 0;

if ($bejelentkezett_id && $partner_id) {
    try {
        // 1. LÉPÉS: Olvasottá tétel (Csak az 'olvasott' oszlopot használjuk, mert 'olvasva_ekkor' nincs)
        $updateSql = "UPDATE uzenetek 
                      SET olvasott = 1 
                      WHERE kuldo_id = :partner AND fogado_id = :me AND olvasott = 0";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            'partner' => $partner_id, 
            'me' => $bejelentkezett_id
        ]);

        // 2. LÉPÉS: Lekérés (Figyelj: 'szoveg' oszlopot kérünk le!)
        $sql = "SELECT id, kuldo_id, fogado_id, szoveg, idopont, olvasott 
                FROM uzenetek 
                WHERE (kuldo_id = :me AND fogado_id = :partner) 
                OR (kuldo_id = :partner AND fogado_id = :me) 
                ORDER BY idopont ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'me' => $bejelentkezett_id, 
            'partner' => $partner_id
        ]);
        
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode([]);
}