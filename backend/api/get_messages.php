<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(); }

require_once "../config/db.php";

$bejelentkezett_id = isset($_GET['kuldo_id']) ? (int)$_GET['kuldo_id'] : 0;
$partner_id = isset($_GET['fogado_id']) ? (int)$_GET['fogado_id'] : 0;

if ($bejelentkezett_id && $partner_id) {
    try {
        // 1. LÉPÉS: Olvasottá tétel ÉS az időpont rögzítése
        // Csak akkor frissítjük, ha még nem volt olvasott (olvasott = 0)
        $updateSql = "UPDATE uzenetek 
                      SET olvasott = 1, idopont = NOW() 
                      WHERE kuldo_id = :partner AND fogado_id = :me AND olvasott = 0";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            'partner' => $partner_id, 
            'me' => $bejelentkezett_id
        ]);

        // 2. LÉPÉS: Lekérés
        $sql = "SELECT id, kuldo_id, fogado_id, szoveg, datum, idopont as olvasva_ekkor, olvasott 
                FROM uzenetek 
                WHERE (kuldo_id = :me AND fogado_id = :partner) 
                OR (kuldo_id = :partner AND fogado_id = :me) 
                ORDER BY datum ASC";
        
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