<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php"; 

$current_id = $_GET['current_id'] ?? 0;
$search = $_GET['search'] ?? '';

try {
  // 1. Lekérjük a te iskoládat
    $userStmt = $pdo->prepare("SELECT iskola_id FROM felhasznalok WHERE id = ?");
    $userStmt->execute([$current_id]);
    $currentUserData = $userStmt->fetch(PDO::FETCH_ASSOC);
    $my_school_id = $currentUserData['iskola_id'] ?? null;

    // 2. SZIGORÚ SZŰRÉS: Csak azokat listázzuk, akik:
    // - nem te vagy (id != :my_id)
    // - ugyanabba az iskolába járnak (iskola_id = :my_school)
    $sql = "SELECT id, nev, szerep, iskola_id 
            FROM felhasznalok 
            WHERE id != :my_id 
            AND iskola_id = :my_school";
    
    // Ha van keresőszó, azt is figyelembe vesszük
    if ($search !== '') {
        $sql .= " AND nev LIKE :term";
    }

    $sql .= " ORDER BY nev ASC";
            
    $stmt = $pdo->prepare($sql);
    $params = [
        'my_id' => $current_id,
        'my_school' => $my_school_id
    ];
    
    if ($search !== '') {
        $params['term'] = "%$search%";
    }

    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($results);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>