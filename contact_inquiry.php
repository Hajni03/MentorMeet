<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Az Angular "pre-flight" kérésének kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Adatok beolvasása
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['uzenet'])) {
    $to = "mentormeet2026@gmail.com"; 
    $subject = "📧 MentorMeet Ügyfél: " . ($data['targy'] ?: 'Érdeklődés') . " [" . date("Y-m-d H:i") . "]";
    
    // Email törzs összeállítása
    $body = "Érkezett egy új üzenet a weboldalról:\n\n";
    $body .= "--------------------------------------\n";
    $body .= "Név: " . ($data['nev'] ?: 'Nincs megadva') . "\n";
    $body .= "Email: " . $data['email'] . "\n";
    $body .= "Tárgy: " . ($data['targy'] ?: 'Nincs') . "\n";
    $body .= "--------------------------------------\n\n";
    $body .= "Üzenet:\n" . $data['uzenet'] . "\n\n";
    $body .= "--------------------------------------\n";
    $body .= "Küldve: " . date("Y-m-d H:i:s");

    // Fejlécek
    $headers = "From: MentorMeet System <noreply@mentormeet.hu>\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    // KÜLDÉS ÉS VÁLASZADÁS
    if (mail($to, $subject, $body, $headers)) {
        // ✅ SIKER: Az Angular ezt a JSON-t várja
        echo json_encode(["status" => "success", "message" => "Email elment"]);
        exit;
    } else {
        // ❌ HIBA: Szerveroldali hiba a küldéskor
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Szerver hiba a küldés során."]);
        exit;
    }
} else {
    // ⚠️ HIBA: Üresen maradt mezők
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok."]);
    exit;
}