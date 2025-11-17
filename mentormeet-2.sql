-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2025. Nov 17. 19:44
-- Kiszolgáló verziója: 8.0.40
-- PHP verzió: 8.3.14

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
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` int NOT NULL,
  `iskola_id` int DEFAULT NULL,
  `nev` varchar(150) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_bin NOT NULL,
  `jelszo` varchar(180) COLLATE utf8mb4_bin NOT NULL,
  `szerep` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `osztaly_id` int DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `id` int NOT NULL,
  `idopont_id` int NOT NULL,
  `diak_id` int NOT NULL,
  `statusz` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `megjegyzes` text COLLATE utf8mb4_bin,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `id` int NOT NULL,
  `tanar_id` int NOT NULL,
  `tantargy_id` int NOT NULL,
  `datum` date NOT NULL,
  `kezdes` time NOT NULL,
  `befejezes` time NOT NULL,
  `max_diak` int NOT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT '1',
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `iskolak`
--

CREATE TABLE `iskolak` (
  `id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `cim` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `telefon` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `web` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `osztalyok`
--

CREATE TABLE `osztalyok` (
  `id` int NOT NULL,
  `iskola_id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `leiras` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanar_tantargy`
--

CREATE TABLE `tanar_tantargy` (
  `tanar_id` int NOT NULL,
  `tantargy_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tantargyak`
--

CREATE TABLE `tantargyak` (
  `id` int NOT NULL,
  `nev` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `leiras` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Indexek a kiírt táblákhoz
--

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
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `iskolak`
--
ALTER TABLE `iskolak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `osztalyok`
--
ALTER TABLE `osztalyok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tantargyak`
--
ALTER TABLE `tantargyak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

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
