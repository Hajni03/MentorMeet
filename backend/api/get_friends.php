<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
require_once "../config/db.php";

$user_id = $_GET['user_id'] ?? 0;

try {
    $sql = "SELECT 
                f.id, 
                f.nev, 
                f.szerep, 
                f.email,
                f.profilkep_eleres,
                f.is_online,
                
                -- GÉPELÉS FIGYELÉSE: Megnézzük az utolsó 3 másodpercet
                (f.utolso_gepeles > NOW() - INTERVAL 3 SECOND AND f.gepel_szamara = :uid) as is_typing,

                -- 1. AL-LEKÉRDEZÉS: Utolsó üzenet szövege
                (SELECT szoveg FROM uzenetek 
                 WHERE (kuldo_id = :uid AND fogado_id = f.id) 
                    OR (kuldo_id = f.id AND fogado_id = :uid) 
                 ORDER BY idopont DESC LIMIT 1) as utolso_uzenet,
                 
                -- 2. AL-LEKÉRDEZÉS: Utolsó üzenet időpontja
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
            AND (k.tanar_id = :uid OR k.diak_id = :uid)
            
            -- Rendezzük a listát: aki legutóbb írt, kerül előre
            ORDER BY utolso_ido DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['uid' => $user_id]);
    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($friends);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>