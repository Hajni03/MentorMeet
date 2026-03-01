<?php
header("Access-Control-Allow-Origin: https://mentormeet.hu");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($user_id == 0) {
    echo json_encode([]);
    exit;
}

try {
    // SQL kiegészítése a perce_aktiv mezővel
    $sql = "SELECT 
                f.id, 
                f.nev, 
                f.szerep, 
                f.email,
                f.profilkep_eleres,
                f.is_online,
                f.utolso_bejelentkezes, -- Ezt is lekérjük a biztonság kedvéért
                
                -- ✅ ÚJ: Kiszámoljuk hány perce volt aktív utoljára
                TIMESTAMPDIFF(MINUTE, f.utolso_bejelentkezes, NOW()) as perce_aktiv,

                -- GÉPELÉS FIGYELÉSE (maradt az eredeti)
                (f.utolso_gepeles > NOW() - INTERVAL 3 SECOND AND f.gepel_szamara = :uid) as is_typing,

                -- Utolsó üzenet szövege (maradt az eredeti)
                (SELECT szoveg FROM uzenetek 
                 WHERE (kuldo_id = :uid AND fogado_id = f.id) 
                    OR (kuldo_id = f.id AND fogado_id = :uid) 
                 ORDER BY idopont DESC LIMIT 1) as utolso_uzenet,
                 
                -- Utolsó üzenet időpontja (maradt az eredeti)
                (SELECT idopont FROM uzenetek 
                 WHERE (kuldo_id = :uid AND fogado_id = f.id) 
                    OR (kuldo_id = f.id AND fogado_id = :uid) 
                 ORDER BY idopont DESC LIMIT 1) as utolso_ido
                 
            FROM kapcsolatok k
            JOIN felhasznalok f ON (
                (k.tanar_id = f.id AND k.diak_id = :uid) OR 
                (k.diak_id = f.id AND k.tanar_id = :uid)
            )
            WHERE k.statusz = 'accepted' 
            AND f.id != :uid
            ORDER BY utolso_ido DESC, f.nev ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['uid' => $user_id]);
    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($friends as &$friend) {
        $friend['is_online'] = (int)$friend['is_online'];
        $friend['is_typing'] = (int)$friend['is_typing'];
        $friend['perce_aktiv'] = (int)$friend['perce_aktiv']; // Számmá alakítjuk az Angularnak
        $friend['utolso_uzenet'] = $friend['utolso_uzenet'] ?? "";
    }

    echo json_encode($friends);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis hiba történt."]);
}
?>