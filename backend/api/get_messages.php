<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

// A lekérdezés paraméterei (kuldo_id a bejelentkezett felhasználó, fogado_id a partner)
$bejelentkezett_id = $_GET['kuldo_id'] ?? 0;
$partner_id = $_GET['fogado_id'] ?? 0;

if ($bejelentkezett_id && $partner_id) {
    try {
        // 1. LÉPÉS: Frissítjük azokat az üzeneteket OLVASOTTRA, amiket NEKEM küldtek
        // Itt mentjük el a NOW() segítségével a megtekintés idejét is
        $updateSql = "UPDATE uzenetek 
                      SET olvasott = 1, olvasva_ekkor = NOW() 
                      WHERE kuldo_id = :partner AND fogado_id = :me AND olvasott = 0";
        
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([
            'partner' => $partner_id, 
            'me' => $bejelentkezett_id
        ]);

        // 2. LÉPÉS: Lekérjük a teljes beszélgetést
        $sql = "SELECT * FROM uzenetek 
                WHERE (kuldo_id = :me AND fogado_id = :partner) 
                OR (kuldo_id = :partner AND fogado_id = :me) 
                ORDER BY idopont ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'me' => $bejelentkezett_id, 
            'partner' => $partner_id
        ]);
        
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($messages);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    echo json_encode([]);
}
?>