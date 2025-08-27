<?php /* index.php – MentorMeet landing váz */ ?>
<!doctype html>
<html lang="hu">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MentorMeet – Egyszerű időpontfoglalás</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Great+Vibes&display=swap"
    rel="stylesheet">

  <style>
    :root {
      --bg-start: #0c0f45;
      --bg-end: #1e22a6;
      --muted: #b8c1ff;
      --pill: #2a39ff;
    }

    body {
      min-height: 100vh;
      background:
        radial-gradient(1200px 800px at 85% 15%, #2b2bcf 0%, transparent 60%),
        linear-gradient(135deg, var(--bg-start), var(--bg-end));
      color: #fff;
      font-family: 'Poppins', system-ui, Segoe UI, Roboto, Arial;
    }

    .container-xl {
      max-width: 1200px;
    }

    .nav-pills .nav-link {
      color: #dbe0ff;
      border-radius: 999px;
      padding: .45rem .9rem;
    }

    .nav-pills .nav-link.active {
      background: var(--pill);
      color: #fff;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, .08) inset;
    }

    .nav-pills .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, .08);
    }

    .logo-word {
      font-weight: 700;
      font-size: clamp(2.2rem, 3.6vw, 3.2rem);
      letter-spacing: .5px;
    }

    .logo-script {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.6rem, 4vw, 3.6rem);
      transform: translateY(.1rem) rotate(-5deg);
    }

    .lead {
      color: var(--muted);
    }

    .cta-btn {
      border: 0;
      border-radius: 999px;
      padding: .75rem 1.25rem;
      background: var(--pill);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 12px 30px rgba(42, 57, 255, .25);
    }

    .cta-btn:hover {
      filter: brightness(1.05);
    }

    .hero-visual {
      width: min(520px, 90%);
      aspect-ratio: 1/1;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 0 0 14px #fff, 0 10px 60px rgba(0, 0, 0, .35);
      margin-inline: auto;
      background: #0b0f2f;
    }

    .hero-visual img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    .mini-footer {
      color: #9aa3ff;
      font-size: .9rem;
      padding: 1rem 0 2rem;
    }
  </style>
</head>

<body class="d-flex flex-column min-vh-100">

  <!-- NAV -->
  <nav class="navbar navbar-expand-md pt-3">
    <div class="container-xl">
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav nav nav-pills gap-2">
          <li class="nav-item"><a class="nav-link active" href="home.php">Főoldal</a></li>
          <li class="nav-item"><a class="nav-link" href="login.php">Bejelentkezés</a></li>
          <li class="nav-item"><a class="nav-link" href="faq.php">GYIK</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.php">Kapcsolat</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <main class="flex-fill">
    <section class="py-5">
      <div class="container-xl">
        <div class="row align-items-center gy-5">
          <div class="col-lg-6">
            <div class="d-flex align-items-baseline gap-1 mb-2">
              <div class="logo-word">Mentor</div>
              <div class="logo-script">Meet</div>
            </div>
            <h1 class="fw-semibold mb-3">Egyszerű időpontfoglalás és kommunikáció</h1>
            <p class="lead mb-4">
              Egy helyen kezelheted a konzultációkat,<br>
              átlátható naptárban láthatod a szabad időpontokat,<br>
              és könnyedén lefoglalhatod a neked megfelelőt.
            </p>
            <a href="signup.php" class="btn cta-btn">Regisztrálj most</a>
          </div>

          <div class="col-lg-6 d-flex justify-content-lg-end">
            <div class="hero-visual">
              <img src="../public/assets/img/hero.png" alt="Tanár segít diáknak">
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="text-center mini-footer mt-auto">
    © <?php echo date('Y'); ?> MentorMeet • Minden jog fenntartva
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>