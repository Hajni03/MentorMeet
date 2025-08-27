<!--BELÉPÉSI PONT-->
<?php
// egyszerű oldalkapcsoló: ?p=home|login|faq|contact
$page = $_GET['p'] ?? 'home';

$map = [
  'home'    => __DIR__ . '/../pages/home.php',
  'login'   => __DIR__ . '/../pages/login.php',
  'faq'     => __DIR__ . '/../pages/faq.php',
  'contact' => __DIR__ . '/../pages/contact.php',
];

if (!isset($map[$page])) { http_response_code(404); $page = 'home'; }

$title = [
  'home' => 'MentorMeet – Egyszerű időpontfoglalás',
  'login' => 'Bejelentkezés – MentorMeet',
  'faq' => 'GYIK – MentorMeet',
  'contact' => 'Kapcsolat – MentorMeet',
][$page];

require __DIR__ . '/partials/head.php';
require __DIR__ . '/partials/nav.php';
require $map[$page];
require __DIR__ . '/partials/footer.php';
?>