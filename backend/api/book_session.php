<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"));

$student_id = isset($data->student_id) ? $data->student_id : (isset($data->diak_id) ? $data->diak_id : null);
$slot_id = isset($data->slot_id) ? $data->slot_id : null;

if (!empty($slot_id) && !empty($student_id)) {
    try {
        $pdo->beginTransaction();

        $check = $pdo->prepare("SELECT tanar_id, datum, kezdes FROM idopontok WHERE id = ? AND aktiv = 1");
        $check->execute([$slot_id]);
        $idopont = $check->fetch(PDO::FETCH_ASSOC);

        if ($idopont) {
            // 1. Foglalás rögzítése (diak_id és idopont_id oszlopok)
            $insFoglalas = $pdo->prepare("INSERT INTO foglalasok (diak_id, idopont_id, statusz) VALUES (?, ?, 'pending')");
            $insFoglalas->execute([$student_id, $slot_id]);

            // 2. Időpont zárolása (aktiv = 2 és diak_id beírása)
            $updateIdopont = $pdo->prepare("UPDATE idopontok SET aktiv = 2, diak_id = ? WHERE id = ?");
            $updateIdopont->execute([$student_id, $slot_id]);

            // 3. Értesítés létrehozása (a Te táblád szerinti slot_id oszloppal!)
            $uzenet = "Új órafoglalás érkezett: " . $idopont['datum'] . " " . substr($idopont['kezdes'], 0, 5);
            $insNotif = $pdo->prepare("INSERT INTO ertesitesek (felhasznalo_id, felado_id, uzenet, tipus, slot_id, olvasott) 
                                       VALUES (?, ?, ?, 'booking', ?, 0)");
            $insNotif->execute([$idopont['tanar_id'], $student_id, $uzenet, $slot_id]);

            $pdo->commit();
            echo json_encode(["message" => "Foglalás sikeres!"]);
        } else {
            throw new Exception("Az időpont nem elérhető.");
        }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "Hiányzó adatok (slot_id vagy diak_id)."]);
}