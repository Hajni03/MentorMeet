<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->slot_id) && !empty($data->action)) {
    try {
        $pdo->beginTransaction();
        $idopont_id = (int)$data->slot_id; 
        
        // ✅ JAVÍTÁS: Kezeljük, ha 'confirm' vagy 'accepted' jön az Angulartól
        $action = trim($data->action);
        $uj_statusz = ($action === 'confirm' || $action === 'accepted') ? 'accepted' : 'rejected';

        // 1. Keressük meg a foglalást. 
        // Kivettem a 'pending' kényszert egy pillanatra a hibakereséshez, 
        // hogy lássuk, egyáltalán létezik-e a rekord.
        $stmtGet = $pdo->prepare("SELECT id, diak_id, statusz FROM foglalasok WHERE idopont_id = ? ORDER BY id DESC LIMIT 1");
        $stmtGet->execute([$idopont_id]);
        $foglalas = $stmtGet->fetch(PDO::FETCH_ASSOC);

        if ($foglalas) {
            $foglalas_id = $foglalas['id'];
            $diak_id = $foglalas['diak_id'];

            // 2. Frissítjük a foglalást
            $stmtUpdate = $pdo->prepare("UPDATE foglalasok SET statusz = ? WHERE id = ?");
            $stmtUpdate->execute([$uj_statusz, $foglalas_id]);

            if ($uj_statusz === 'accepted') {
                // Naptár pirosra állítása (aktiv = 1 és van diak_id)
                $stmtIdo = $pdo->prepare("UPDATE idopontok SET diak_id = ?, aktiv = 1 WHERE id = ?");
                $stmtIdo->execute([$diak_id, $idopont_id]);
                
                // Értesítés olvasottá tétele
                $stmtNotif = $pdo->prepare("UPDATE ertesitesek SET olvasott = 1 WHERE tipus = 'booking' AND slot_id = ?");
                $stmtNotif->execute([$idopont_id]);
                
                $msg = "Foglalás sikeresen elfogadva!";
            } else {
                // Elutasítás: naptár felszabadítása
                $stmtIdo = $pdo->prepare("UPDATE idopontok SET diak_id = NULL, aktiv = 1 WHERE id = ?");
                $stmtIdo->execute([$idopont_id]);
                $msg = "Foglalás elutasítva.";
            }

            $pdo->commit();
            echo json_encode(["message" => $msg, "status" => $uj_statusz]);
        } else {
            // ✅ DEBUG: Ha nem talál foglalást az adatbázisban
            echo json_encode(["message" => "Hiba: Nem található foglalási rekord ehhez az időponthoz (ID: $idopont_id).", "status" => "error"]);
            $pdo->rollBack();
        }

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Hiányzó adatok a kérésben.", "status" => "error"]);
}