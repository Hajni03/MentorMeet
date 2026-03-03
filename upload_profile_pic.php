<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// 1. Ellenőrizzük, hogy érkezett-e fájl és user_id
if (isset($_FILES['profile_pic']) && isset($_POST['user_id'])) {
    
    $user_id = (int)$_POST['user_id'];
    $file = $_FILES['profile_pic'];
    
    // 2. Beállítások
    $target_dir = "../../uploads/profiles/"; // Relatív út a mappához
    $public_url = "https://mentormeet.hu/uploads/profiles/"; // Webes elérhetőség
    
    // Mappa létrehozása, ha nem létezne
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    // 3. Fájlnév generálása (id + időbélyeg a felülírás ellen)
    $file_extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $new_filename = "user_" . $user_id . "_" . time() . "." . $file_extension;
    $target_file = $target_dir . $new_filename;

    // 4. Biztonsági ellenőrzések
    $check = getimagesize($file["tmp_name"]);
    if($check === false) {
        echo json_encode(["error" => "A fájl nem kép!"]);
        exit;
    }

    // Méret korlát (pl. 2MB)
    if ($file["size"] > 2000000) {
        echo json_encode(["error" => "A fájl túl nagy! Max 2MB."]);
        exit;
    }

    // Formátum korlát
    if(!in_array($file_extension, ["jpg", "jpeg", "png", "gif"])) {
        echo json_encode(["error" => "Csak JPG, JPEG, PNG és GIF engedélyezett."]);
        exit;
    }

    // 5. Mozgatás a végleges helyére
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // ✅ SIKER: Visszaküldjük a teljes URL-t az Angularnak
        echo json_encode([
            "success" => true,
            "url" => $public_url . $new_filename
        ]);
    } else {
        echo json_encode(["error" => "Hiba történt a fájl mentésekor a szerveren."]);
    }

} else {
    echo json_encode(["error" => "Nincs fájl vagy felhasználó ID a kérésben."]);
}
?>