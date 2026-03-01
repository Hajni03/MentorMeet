<?php
// JAVÍTÁS: Éles HTTPS domain engedélyezése
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php"; 

$current_id = $_GET['current_id'] ?? 0;
$search = $_GET['search'] ?? '';

if ($current_id == 0) {
    echo json_encode([]);
    exit;
}

try {
    // 1. Aktuális felhasználó adatainak lekérése
    $userStmt = $pdo->prepare("SELECT iskola_id, szerep FROM felhasznalok WHERE id = ?");
    $userStmt->execute([$current_id]);
    $currentUserData = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$currentUserData) {
        echo json_encode([]);
        exit;
    }

    $my_school_id = $currentUserData['iskola_id'];
    $my_role = $currentUserData['szerep'];
    // Ha diák vagyok, tanárt keresek, és fordítva
    $target_role = ($my_role === 'diak') ? 'tanar' : 'diak';

    // 2. SZŰRÉS: Iskola + Ellentétes szerepkör + NINCS MÉG ELFOGADOTT KAPCSOLAT
    // JAVÍTÁS: A tábla neve nálad 'kapcsolatok', nem 'ismerosok'!
    $sql = "SELECT id, nev, szerep, iskola_id, profilkep_eleres
            FROM felhasznalok 
            WHERE id != :my_id 
            AND iskola_id = :my_school
            AND szerep = :target_role
            
            -- Kiszűrjük azokat, akikkel már van ELFOGADOTT kapcsolatunk --
            AND NOT EXISTS (
                SELECT 1 FROM kapcsolatok 
                WHERE statusz = 'accepted' AND (
                    (tanar_id = :my_id AND diak_id = felhasznalok.id) OR 
                    (diak_id = :my_id AND tanar_id = felhasznalok.id)
                )
            )";
    
    if ($search !== '') {
        $sql .= " AND (nev LIKE :term OR email LIKE :term)";
    }

    $sql .= " ORDER BY nev ASC";
            
    $stmt = $pdo->prepare($sql);
    $params = [
        'my_id' => $current_id,
        'my_school' => $my_school_id,
        'target_role' => $target_role
    ];
    
    if ($search !== '') {
        $params['term'] = "%$search%";
    }

    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch(Exception $e) {
    http_response_code(500);
    // Élesben ne írjuk ki a pontos hibaüzenetet
    echo json_encode(["error" => "Hiba történt a keresés során."]);
}
?>