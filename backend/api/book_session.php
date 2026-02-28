<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->slot_id) && !empty($data->student_id)) {
    try {
        $pdo->beginTransaction();

        // 1. Ellenőrizzük, hogy az időpont még szabad-e (aktiv = 1)
        $check = $pdo->prepare("SELECT tanar_id, datum, kezdes FROM idopontok WHERE id = ? AND aktiv = 1");
        $check->execute([$data->slot_id]);
        $idopont = $check->fetch(PDO::FETCH_ASSOC);

        if ($idopont) {
            // 2. Létrehozzuk a rekordot a FOGLALASOK táblában
            $insFoglalas = $pdo->prepare("INSERT INTO foglalasok (diak_id, idopont_id, statusz, letrehozva) VALUES (?, ?, 'pending', NOW())");
            $insFoglalas->execute([$data->student_id, $data->slot_id]);

            // 3. FONTOS: Az IDOPONTOK táblában az állapotot átállítjuk 2-re (Foglalt/Függőben)
            // Így a naptár lekérdezése (ami csak az aktiv=1-et nézi) már nem fogja látni
            $updateIdopont = $pdo->prepare("UPDATE idopontok SET aktiv = 2 WHERE id = ?");
            $updateIdopont->execute([$data->slot_id]);

            // 4. Értesítés a tanárnak
            $msg = "Új órafoglalás: " . $idopont['datum'] . " " . substr($idopont['kezdes'], 0, 5);
            $insNotif = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, slot_id, olvasott) VALUES (?, ?, ?, 'booking', ?, 0)");
            $insNotif->execute([$idopont['tanar_id'], $data->student_id, $msg, $data->slot_id]);

            $pdo->commit();
            echo json_encode(["message" => "Foglalás elküldve, az időpont rögzítve!"]);
        } else {
            throw new Exception("Sajnos ez az időpont már nem elérhető.");
        }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó adatok."]);
}
?>