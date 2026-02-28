<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php"; 

$current_id = $_GET['current_id'] ?? 0;
$search = $_GET['search'] ?? '';

try {
    // 1. Felhasználó adatainak lekérése
    $userStmt = $pdo->prepare("SELECT iskola_id, szerep FROM felhasznalok WHERE id = ?");
    $userStmt->execute([$current_id]);
    $currentUserData = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    $my_school_id = $currentUserData['iskola_id'] ?? null;
    $my_role = $currentUserData['szerep'] ?? null;
    $target_role = ($my_role === 'diak') ? 'tanar' : 'diak';

    // 2. SZŰRÉS: Iskola + Ellentétes szerepkör + NINCS MÉG KAPCSOLAT
    $sql = "SELECT id, nev, szerep, iskola_id, profilkep_eleres,
            (SELECT COUNT(*) FROM uzenetek 
             WHERE kuldo_id = felhasznalok.id 
             AND fogado_id = :my_id 
             AND olvasott = 0) as unread_count
            FROM felhasznalok 
            WHERE id != :my_id 
            AND iskola_id = :my_school
            AND szerep = :target_role
            
            -- EZ A RÉSZ SZŰRI KI A MÁR ISMERŐSÖKET --
            AND NOT EXISTS (
                SELECT 1 FROM ismerosok 
                WHERE (tanar_id = :my_id AND diak_id = felhasznalok.id AND statusz = 'accepted')
                OR (diak_id = :my_id AND tanar_id = felhasznalok.id AND statusz = 'accepted')
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
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>