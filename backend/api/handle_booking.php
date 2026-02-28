<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";
$data = json_decode(file_get_contents("php://input"));

// A harangból érkező 'slot_id' nálad a 'idopont_id' oszlopnak felel meg!
if (!empty($data->slot_id) && !empty($data->action)) {
    try {
        $uj_statusz = ($data->action === 'confirm') ? 'accepted' : 'rejected';

        // FRISSÍTÉS: A 'foglalasok' táblában az 'idopont_id' oszlopot módosítjuk
        $sql = "UPDATE foglalasok SET statusz = ? WHERE idopont_id = ? AND statusz = 'pending'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$uj_statusz, $data->slot_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Sikeresen módosítva: " . $uj_statusz]);
        } else {
            // Ez akkor van, ha az ID nem egyezik, vagy már el lett fogadva
            echo json_encode(["message" => "Nem található módosítható foglalás ezzel az ID-val: " . $data->slot_id]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}