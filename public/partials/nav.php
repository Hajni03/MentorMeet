<?php
  // $active változó alapján "active" osztály
  function is_active($key, $active) { return isset($active) && $active === $key ? 'active' : ''; }
?>
<nav class="navbar navbar-expand-lg mm-navbar">
  <div class="container">
    <a class="navbar-brand fw-bold text-white" href="/index.php">Mentor<span class="mm-accent">Meet</span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mmNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mmNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link <?php echo is_active('home', $active ?? ''); ?>" href="/pages/home.php">Főoldal</a></li>
        <li class="nav-item"><a class="nav-link <?php echo is_active('login', $active ?? ''); ?>" href="/pages/login.php">Bejelentkezés</a></li>
        <li class="nav-item"><a class="nav-link <?php echo is_active('faq', $active ?? ''); ?>" href="/pages/faq.php">GYIK</a></li>
        <li class="nav-item"><a class="nav-link <?php echo is_active('contact', $active ?? ''); ?>" href="/pages/contact.php">Kapcsolat</a></li>
      </ul>
    </div>
  </div>
</nav>
