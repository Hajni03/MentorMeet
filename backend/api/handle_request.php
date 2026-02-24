<?php
// 1. Fejlécek MINDEN előtt
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// 2. OPTIONS azonnali kezelése (Preflight kérés)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Adatbázis kapcsolat
require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["message" => "Hiányzó adatok!"]);
    exit;
}

try {
    // Mivel az Angular az ertesites.id-t küldi, meg kell keresnünk a hozzá tartozó kapcsolatot.
    // Ha az ertesitesek tábládba nem mentetted el a kapcsolat_id-t, 
    // akkor a legegyszerűbb, ha a tanar_id és diak_id alapján keresünk.
    
    // IDEIGLENES JAVÍTÁS: Frissítsük a státuszt. 
    // MEGJEGYZÉS: Ha van kapcsolat_id-d az értesítésben, használd azt!
    $stmt = $pdo->prepare("UPDATE kapcsolatok SET statusz = ? WHERE id = ?");
    $stmt->execute([$data['status'], $data['id']]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(["message" => "Nem találtam frissíthető kapcsolatot ezzel az ID-val: " . $data['id']]);
    } else {
        $msg = $data['status'] === 'accepted' ? "Kapcsolat elfogadva!" : "Kapcsolat elutasítva.";
        echo json_encode(["message" => $msg]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Hiba: " . $e->getMessage()]);
}