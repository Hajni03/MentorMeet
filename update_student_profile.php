<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    try {
        // ✅ JAVÍTOTT SQL: Az oszlop neve profilkep_eleres
        $sql = "UPDATE felhasznalok 
                SET nev = :nev, 
                    iskola_id = :iskola_id, 
                    szak_id = :szak_id, 
                    bemutatkozas = :bemutatkozas,
                    profilkep_eleres = :profilkep_eleres
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);

        // Adat-egyeztetés a frontend változónevekkel
        // Ha az Angularból 'profil_kep' néven jön, azt rendeljük hozzá
        $bio = $data['bio'] ?? $data['bemutatkozas'] ?? null;
        $profil_url = $data['profil_kep'] ?? $data['profilkep_eleres'] ?? null;

        $stmt->execute([
            'nev'              => $data['nev'],
            'iskola_id'        => !empty($data['iskola_id']) ? (int)$data['iskola_id'] : null,
            'szak_id'          => !empty($data['szak_id']) ? (int)$data['szak_id'] : null,
            'bemutatkozas'     => $bio,
            'profilkep_eleres' => $profil_url, // Mentés az adatbázisba
            'id'               => (int)$data['id']
        ]);

        echo json_encode([
            "success" => true, 
            "message" => "Profil sikeresen frissítve!",
            "debug_url" => $profil_url
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "SQL hiba: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Hiányzó azonosító!"]);
}
?>