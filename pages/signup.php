<!doctype html>
<html lang="hu">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MentorMeet – Regisztráció</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Google fontok -->
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet">

    <style>
        :root {
            --mm-dark: #0c0f45;
            --mm-dark-2: #1e22a6;
            --mm-accent: #e4f1ff;
            --mm-green: #2bb673;
        }

        body {
            font-family: "Poppins", sans-serif;
            margin: 0;
            background: linear-gradient(135deg, var(--mm-dark) 0%, var(--mm-dark-2) 100%);
        }

        /* NAVBAR */
        .navbar {
            background: transparent !important;
            /* nincs háttér */
            position: absolute;
            /* „ráül” a tartalomra */
            top: 0;
            left: 0;
            width: 100%;
            padding: 1rem 2rem;
            z-index: 10;
            /* mindig a tartalom fölött */
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.6rem;
            color: #fff !important;
        }

        .navbar-brand .meet {
            font-family: 'Great Vibes', cursive;
            font-weight: 400;
            font-size: 1.8rem;
            margin-left: .25rem;
            color: var(--mm-accent);
        }

        .nav-link {
            color: #fff !important;
            margin-left: 1rem;
            font-weight: 500;
            padding: .4rem 1rem;
            /* hogy legyen hely a háttérnek */
            border-radius: 20px;
            /* lekerekített háttér */
            transition: all 0.3s ease;
            /* finom animáció */
        }

        .nav-link:hover {
            color: var(--mm-accent) !important;
            background: rgba(255, 255, 255, 0.15);
            /* halvány fehér háttér */
            color: #fff !important;
            /* maradjon fehér szöveg */
        }


        /* fő háttér */
        .signup-section {
            background: linear-gradient(135deg, var(--mm-dark) 0%, var(--mm-dark-2) 100%);
            min-height: 100vh;
            color: #fff;
        }

        .mm-left {
            padding: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: left;
        }

        .mm-left h1 {
            font-weight: 700;
            font-size: 2.5rem;
        }

        .mm-left h1 .meet {
            font-family: 'Great Vibes', cursive;
            font-weight: 400;
            font-size: 2.7rem;
            color: var(--mm-accent);
        }

        .mm-left p {
            color: rgba(255, 255, 255, .7)
        }

        /* jobb oldal blur */
        .mm-right {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;

            background: transparent;
            /*hogy a body gradient látszódjon */
        }

        .mm-right::before {
            content: "";
            position: absolute;
            inset: 0;
            background: url("../public/assets/img/background.png") right center / cover no-repeat;
            filter: blur(8px);
            z-index: 0;
        }

        .mm-glass {
            position: relative;
            z-index: 2;
            background: linear-gradient(to bottom right,
                    rgba(20, 25, 55, 0.75),
                    rgba(20, 25, 55, 0.55));
            border: 1px solid rgba(255, 255, 255, 0.35);
            backdrop-filter: saturate(120%) blur(8px);
            -webkit-backdrop-filter: saturate(120%) blur(8px);
            border-radius: 20px;
            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.45),
                /* erősebb árnyék a háttérből kiemeléshez */
                0 0 0 1px rgba(255, 255, 255, 0.08) inset;
            /* finom belső kontúr */
            padding: 2rem;
        }

        .mm-input {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #dfe6ff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .mm-input:focus {
            border-color: #b9ccff;
            box-shadow: 0 0 0 .25rem rgba(113, 145, 255, .25);
        }

        .mm-cta {
            background: #2bb673;
            border: none;
            border-radius: 999px;
            padding: .9rem 1.25rem;
            box-shadow: 0 10px 24px rgba(43, 182, 115, 0.35);
            font-weight: 600;
            letter-spacing: .5px;
        }

        .mm-cta:hover {
            filter: brightness(1.05);
        }

        .form-check-inline {
            margin: 0 1rem;
        }

        .link-light {
            color: #e9f0ff !important;
        }

        a {
            color: white;
        }
    </style>
</head>

<body>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg">
        <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navmenu">
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="home.php">Főoldal</a></li>
                <li class="nav-item"><a class="nav-link" href="login.php">Bejelentkezés</a></li>
                <li class="nav-item"><a class="nav-link" href="faq.php">GYIK</a></li>
                <li class="nav-item"><a class="nav-link" href="contact.php">Kapcsolat</a></li>
            </ul>
        </div>
    </nav>

    <!-- TARTALOM -->
    <main class="signup-section">
        <div class="container-fluid g-0">
            <div class="row g-0 min-vh-100">

                <!-- Bal oldal -->
                <section class="col-12 col-lg-6 mm-left">
                    <div>
                        <h1>Mentor<span class="meet">Meet</span></h1>
                        <p class="lead">
                            Regisztrálj, hogy hozzáférhess a szolgáltatásaink összes funkciójához.
                        </p>
                        <p>
                            Kezeld egyszerűen konzultációidat egy helyen – időpontok és foglalások, mind átláthatóan.
                        </p>
                    </div>
                </section>

                <!-- Jobb oldal -->
                <section class="col-12 col-lg-6 mm-right">
                    <div class="mm-glass text-white">
                        <h2 class="h1 fw-bold mb-4 text-center">Regisztráció</h2>

                        <form action="#" method="post">
                            <!-- Szerep -->
                            <div class="mb-3 d-flex justify-content-center">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="role" id="role-teacher"
                                        value="teacher" required>
                                    <label class="form-check-label text-white" for="role-teacher">Tanár</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="role" id="role-student"
                                        value="student">
                                    <label class="form-check-label text-white" for="role-student">Diák</label>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="mb-3">
                                <label for="email" class="form-label text-white">Email</label>
                                <input type="email" class="form-control mm-input" id="email" name="email"
                                    placeholder="nev@iskola.hu" required>
                            </div>

                            <!-- GDPR -->
                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" id="gdpr" required>
                                <label class="form-check-label text-white-50" for="gdpr">
                                    Elfogadom az <a href="#">adatvédelmi irányelveket</a>
                                </label>
                            </div>

                            <!-- CTA -->
                            <div class="d-grid mb-3">
                                <button class="btn btn-success btn-lg mm-cta" type="submit">Regisztráció</button>
                            </div>

                            <p class="text-center m-0">
                                <a class="link-light text-decoration-underline" href="#">
                                    Van már fiókod? Jelentkezz be itt!
                                </a>
                            </p>
                        </form>
                    </div>
                </section>

            </div>
        </div>
    </main>
    <!-- FOOTER -->
    <footer class="text-center mini-footer mt-auto">
        © <?php echo date('Y'); ?> MentorMeet • Minden jog fenntartva
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>