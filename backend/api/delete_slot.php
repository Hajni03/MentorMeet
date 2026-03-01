<?php
// ✅ JAVÍTÁS: Éles domain és fejléc beállítások
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->slot_id)) {
    try {
        $pdo->beginTransaction();

        // 1. Megnézzük, van-e hozzá kapcsolódó foglalás
        // Ha van, érdemesebb az időpontot csak inaktiválni, hogy a foglalási napló megmaradjon
        $sql = "UPDATE idopontok SET aktiv = 0, diak_id = NULL WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data->slot_id]);

        if ($stmt->rowCount() > 0) {
            $pdo->commit();
            echo json_encode(["message" => "Időpont sikeresen eltávolítva a naptárból."]);
        } else {
            $pdo->rollBack();
            echo json_encode(["message" => "Nem található aktív időpont ezzel az ID-val."]);
        }

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Adatbázis hiba: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó slot_id."]);
}
?>