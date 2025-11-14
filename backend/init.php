<?php
// CORS engedélyezése (különböző domainről is elérhető legyen)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// 🔹 Adatbázis kapcsolat (pl. MySQL)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mentormeet"; // saját adatbázisnév

$conn = new mysqli($servername, $username, $password, $dbname);

// 🔹 Hibakezelés
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Adatbázis kapcsolat sikertelen: " . $conn->connect_error]);
    exit;
}

// 🔹 Példa lekérdezés
$sql = "SELECT id, name, email FROM users LIMIT 5";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// 🔹 JSON válasz
echo json_encode($data);

// 🔹 Kapcsolat lezárása
$conn->close();
?>