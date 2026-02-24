-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Gép: db:3306
-- Létrehozás ideje: 2026. Feb 24. 19:27
-- Kiszolgáló verziója: 8.0.45
-- PHP verzió: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `mentormeet`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertesitesek`
--

CREATE TABLE `ertesitesek` (
  `id` int NOT NULL,
  `felhasznalo_id` int NOT NULL,
  `uzenet` text COLLATE utf8mb4_general_ci NOT NULL,
  `tipus` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'info',
  `olvasott` tinyint(1) DEFAULT '0',
  `datum` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` int NOT NULL,
  `iskola_id` int DEFAULT NULL,
  `nev` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_general_ci NOT NULL,
  `jelszo` varchar(180) COLLATE utf8mb4_general_ci NOT NULL,
  `szerep` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szuletes_datum` date DEFAULT NULL,
  `bemutatkozas` text COLLATE utf8mb4_general_ci,
  `profilkep_eleres` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `osztaly_id` int DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_online` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`id`, `iskola_id`, `nev`, `email`, `jelszo`, `szerep`, `telefonszam`, `szuletes_datum`, `bemutatkozas`, `profilkep_eleres`, `osztaly_id`, `letrehozva`, `is_online`) VALUES
(1, 5, 'ddominika', 'ss@gmail.com', '$2y$10$M72AJIwY9tneb6GKCYtZvuKvfglOya6LRjFvRGCwO1t1tjXxwggkC', 'diak', NULL, NULL, NULL, NULL, 7, '2025-12-09 10:42:57', 0),
(2, 5, 'Domján Dominika', 'domjan.dominika2024@gmail.com', '$2y$10$Wz4J7Nn6m638DJgD8xN6Tu/VWQ.FAaFboDLaW99vmCWrFw6fX0zli', 'diak', NULL, NULL, NULL, NULL, 7, '2026-01-05 16:17:26', 0),
(3, 1, 'Diak Teszt', 'diak@teszt.com', '$2y$10$C4hPZ2qq.RcRPKj8pyYLau8xFwoGJV1urCz7bQEp4jYKOhw7iogly', 'diak', NULL, NULL, NULL, NULL, 1, '2026-01-06 08:45:17', 0),
(4, 3, 'tanar teszt', 'tanar@teszt.com', '$2y$10$sytJRAo.Kb/7ejWGdQNmpuP8GFDL/xsDTM3pd2/Sck7sH1kd88MEu', 'tanar', NULL, NULL, NULL, NULL, NULL, '2026-01-06 09:12:36', 0),
(5, 1, 'Diak Teszt 2', 'diakteszt@teszt.com', '$2y$10$pv/mSDu9irYhdfHyAZRjsetoQ4122/8n5nbxSn9NvTbTSbpQOmeYW', 'diak', NULL, NULL, NULL, NULL, 1, '2026-01-06 09:34:07', 0),
(6, 2, 'Tanár Teszt 2', 'tanarteszt@teszt.com', '$2y$10$FUeJmQhmZjR2cLELCEwZ8ejlQpFO3PodK.xANZZKtjfsa8jQ9UxfO', 'tanar', NULL, '2000-05-09', 'Teszt bio szöveg', NULL, NULL, '2026-01-06 09:59:01', 0),
(7, 5, 'Szabó Péter', 'szabo.peter@simonyiszki.org', '$2y$10$0hRd6yDCtQxbQy8C2mhp6eaLwmKChvOjeWUzL5VdBX.HJUMPWoEXy', 'tanar', NULL, NULL, NULL, NULL, NULL, '2026-02-24 18:10:13', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `id` int NOT NULL,
  `idopont_id` int NOT NULL,
  `diak_id` int NOT NULL,
  `statusz` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `megjegyzes` text COLLATE utf8mb4_unicode_ci,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `id` int NOT NULL,
  `tanar_id` int NOT NULL,
  `diak_id` int DEFAULT NULL,
  `tantargy_id` int DEFAULT NULL,
  `datum` date NOT NULL,
  `kezdes` time NOT NULL,
  `befejezes` time NOT NULL,
  `max_diak` int DEFAULT '1',
  `aktiv` tinyint(1) NOT NULL DEFAULT '1',
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `idopontok`
--

INSERT INTO `idopontok` (`id`, `tanar_id`, `diak_id`, `tantargy_id`, `datum`, `kezdes`, `befejezes`, `max_diak`, `aktiv`, `letrehozva`) VALUES
(1, 6, NULL, NULL, '2026-01-09', '10:00:00', '10:30:00', 1, 1, '2026-01-08 17:44:49'),
(2, 6, NULL, NULL, '2026-01-09', '14:00:00', '14:30:00', 1, 1, '2026-01-08 17:46:21'),
(3, 6, NULL, NULL, '2026-01-10', '13:00:00', '13:30:00', 1, 1, '2026-01-08 17:46:40');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `iskolak`
--

CREATE TABLE `iskolak` (
  `id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cim` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `web` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `iskolak`
--

INSERT INTO `iskolak` (`id`, `nev`, `cim`, `telefon`, `email`, `web`, `aktiv`) VALUES
(1, 'Budapesti Műszaki Egyetem', '1111 Budapest, Műegyetem rakpart 3.', '0611234567', 'info@bme.hu', 'https://www.bme.hu', 1),
(2, 'Eötvös Loránd Tudományegyetem', '1053 Budapest, Egyetem tér 1-3.', '0612345678', 'info@elte.hu', 'https://www.elte.hu', 1),
(3, 'Debreceni Egyetem', '4032 Debrecen, Egyetem tér 1.', '0652123456', 'info@unideb.hu', 'https://www.unideb.hu', 1),
(4, 'Szegedi Tudományegyetem', '6720 Szeged, Dugonics tér 13.', '0620432123', 'info@u-szeged.hu', 'https://www.u-szeged.hu', 1),
(5, 'Pécsi Tudományegyetem', '7622 Pécs, Vasvári Pál u. 4.', '0672365897', 'info@pte.hu', 'https://www.pte.hu', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kapcsolatok`
--

CREATE TABLE `kapcsolatok` (
  `id` int NOT NULL,
  `diak_id` int NOT NULL,
  `tanar_id` int NOT NULL,
  `statusz` enum('pending','accepted','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `letrehozva` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `kapcsolatok`
--

INSERT INTO `kapcsolatok` (`id`, `diak_id`, `tanar_id`, `statusz`, `letrehozva`) VALUES
(1, 5, 6, 'pending', '2026-01-08 09:01:22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `osztalyok`
--

CREATE TABLE `osztalyok` (
  `id` int NOT NULL,
  `iskola_id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leiras` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `osztalyok`
--

INSERT INTO `osztalyok` (`id`, `iskola_id`, `nev`, `leiras`) VALUES
(1, 1, '9.A', 'Általános gimnáziumi osztály'),
(2, 1, '10.B', 'Reál tagozatos osztály'),
(3, 2, '11.C', 'Emelt szintű angol osztály'),
(4, 2, '12.D', 'Informatika orientált osztály'),
(5, 3, '9.E', 'Közgazdasági szakirány'),
(6, 4, '10.F', 'Biológia-kémia fakultáció'),
(7, 5, '11.G', 'Művészeti osztály');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanar_tantargy`
--

CREATE TABLE `tanar_tantargy` (
  `tanar_id` int NOT NULL,
  `tantargy_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `tanar_tantargy`
--

INSERT INTO `tanar_tantargy` (`tanar_id`, `tantargy_id`) VALUES
(6, 2),
(6, 6),
(7, 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tantargyak`
--

CREATE TABLE `tantargyak` (
  `id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `leiras` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `tantargyak`
--

INSERT INTO `tantargyak` (`id`, `nev`, `leiras`) VALUES
(1, 'IKT', NULL),
(2, 'IKT2', NULL),
(3, 'Mobil alkalmazás fejlesztés', NULL),
(4, 'Backend', NULL),
(5, 'Szakmai angol nyelv', NULL),
(6, 'Frontend', NULL),
(7, 'Háló2', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ertesitesek`
--
ALTER TABLE `ertesitesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `iskola_id` (`iskola_id`),
  ADD KEY `osztaly_id` (`osztaly_id`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idopont_id` (`idopont_id`),
  ADD KEY `diak_id` (`diak_id`);

--
-- A tábla indexei `idopontok`
--
ALTER TABLE `idopontok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tanar_id` (`tanar_id`),
  ADD KEY `tantargy_id` (`tantargy_id`);

--
-- A tábla indexei `iskolak`
--
ALTER TABLE `iskolak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kapcsolatok`
--
ALTER TABLE `kapcsolatok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_connection` (`diak_id`,`tanar_id`),
  ADD KEY `tanar_id` (`tanar_id`);

--
-- A tábla indexei `osztalyok`
--
ALTER TABLE `osztalyok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `iskola_id` (`iskola_id`);

--
-- A tábla indexei `tanar_tantargy`
--
ALTER TABLE `tanar_tantargy`
  ADD PRIMARY KEY (`tanar_id`,`tantargy_id`),
  ADD KEY `tantargy_id` (`tantargy_id`);

--
-- A tábla indexei `tantargyak`
--
ALTER TABLE `tantargyak`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `ertesitesek`
--
ALTER TABLE `ertesitesek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `iskolak`
--
ALTER TABLE `iskolak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `kapcsolatok`
--
ALTER TABLE `kapcsolatok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `osztalyok`
--
ALTER TABLE `osztalyok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `tantargyak`
--
ALTER TABLE `tantargyak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ertesitesek`
--
ALTER TABLE `ertesitesek`
  ADD CONSTRAINT `ertesitesek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD CONSTRAINT `felhasznalok_ibfk_1` FOREIGN KEY (`iskola_id`) REFERENCES `iskolak` (`id`),
  ADD CONSTRAINT `felhasznalok_ibfk_2` FOREIGN KEY (`osztaly_id`) REFERENCES `osztalyok` (`id`);

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`idopont_id`) REFERENCES `idopontok` (`id`),
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`diak_id`) REFERENCES `felhasznalok` (`id`);

--
-- Megkötések a táblához `idopontok`
--
ALTER TABLE `idopontok`
  ADD CONSTRAINT `idopontok_ibfk_1` FOREIGN KEY (`tanar_id`) REFERENCES `felhasznalok` (`id`),
  ADD CONSTRAINT `idopontok_ibfk_2` FOREIGN KEY (`tantargy_id`) REFERENCES `tantargyak` (`id`);

--
-- Megkötések a táblához `kapcsolatok`
--
ALTER TABLE `kapcsolatok`
  ADD CONSTRAINT `kapcsolatok_ibfk_1` FOREIGN KEY (`diak_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kapcsolatok_ibfk_2` FOREIGN KEY (`tanar_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `osztalyok`
--
ALTER TABLE `osztalyok`
  ADD CONSTRAINT `osztalyok_ibfk_1` FOREIGN KEY (`iskola_id`) REFERENCES `iskolak` (`id`);

--
-- Megkötések a táblához `tanar_tantargy`
--
ALTER TABLE `tanar_tantargy`
  ADD CONSTRAINT `tanar_tantargy_ibfk_1` FOREIGN KEY (`tanar_id`) REFERENCES `felhasznalok` (`id`),
  ADD CONSTRAINT `tanar_tantargy_ibfk_2` FOREIGN KEY (`tantargy_id`) REFERENCES `tantargyak` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
