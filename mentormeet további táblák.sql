-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2025. Aug 26. 08:52
-- Kiszolgáló verziója: 5.7.24
-- PHP verzió: 8.3.1

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
-- Tábla szerkezet ehhez a táblához `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `nev` varchar(200) DEFAULT NULL,
  `ido` datetime DEFAULT NULL,
  `tanar_id` int(11) DEFAULT NULL,
  `diak_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `diak`
--

CREATE TABLE `diak` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `azonosito` varchar(6) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `nev` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `konzultacio`
--

CREATE TABLE `konzultacio` (
  `id` int(11) NOT NULL,
  `megnevezes` varchar(200) DEFAULT NULL,
  `idopont` datetime DEFAULT NULL,
  `tanar_id` int(11) DEFAULT NULL,
  `diak_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanar`
--

CREATE TABLE `tanar` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `azonosito` varchar(6) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `nev` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tanar_id` (`tanar_id`),
  ADD KEY `diak_id` (`diak_id`);

--
-- A tábla indexei `diak`
--
ALTER TABLE `diak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `azonosito` (`azonosito`);

--
-- A tábla indexei `konzultacio`
--
ALTER TABLE `konzultacio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tanar_id` (`tanar_id`),
  ADD KEY `diak_id` (`diak_id`);

--
-- A tábla indexei `tanar`
--
ALTER TABLE `tanar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `azonosito` (`azonosito`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `diak`
--
ALTER TABLE `diak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `konzultacio`
--
ALTER TABLE `konzultacio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tanar`
--
ALTER TABLE `tanar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`tanar_id`) REFERENCES `tanar` (`id`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`diak_id`) REFERENCES `diak` (`id`);

--
-- Megkötések a táblához `konzultacio`
--
ALTER TABLE `konzultacio`
  ADD CONSTRAINT `konzultacio_ibfk_1` FOREIGN KEY (`tanar_id`) REFERENCES `tanar` (`id`),
  ADD CONSTRAINT `konzultacio_ibfk_2` FOREIGN KEY (`diak_id`) REFERENCES `diak` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
