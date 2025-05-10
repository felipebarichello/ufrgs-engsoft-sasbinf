-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           11.7.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para sasbinf
CREATE DATABASE IF NOT EXISTS `sasbinf` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `sasbinf`;

-- Copiando estrutura para tabela sasbinf.bookings
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `room_id` int(11) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `IX_bookings_room_id` (`room_id`),
  UNIQUE KEY `IX_bookings_user_id` (`user_id`),
  CONSTRAINT `FK_bookings_members_user_id` FOREIGN KEY (`user_id`) REFERENCES `members` (`uid`),
  CONSTRAINT `FK_bookings_rooms_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela sasbinf.bookings: ~1 rows (aproximadamente)
DELETE FROM `bookings`;
INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `start_date`, `end_date`) VALUES
	(1, 1, 6, '2025-05-14 15:00:00', '2025-05-14 16:00:00');

-- Copiando estrutura para tabela sasbinf.members
DROP TABLE IF EXISTS `members`;
CREATE TABLE IF NOT EXISTS `members` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `passwd_hash` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_uca1400_ai_ci NOT NULL,
  `timedout_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela sasbinf.members: ~1 rows (aproximadamente)
DELETE FROM `members`;
INSERT INTO `members` (`uid`, `username`, `passwd_hash`, `timedout_until`, `created_at`) VALUES
	(1, 'fabricio', 'senha', NULL, '2025-05-06 01:49:19');

-- Copiando estrutura para tabela sasbinf.rooms
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `capacity` int(11) NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela sasbinf.rooms: ~7 rows (aproximadamente)
DELETE FROM `rooms`;
INSERT INTO `rooms` (`room_id`, `capacity`) VALUES
	(0, 6),
	(1, 6),
	(2, 6),
	(3, 6),
	(4, 6),
	(5, 6),
	(6, 8);

-- Copiando estrutura para tabela sasbinf.__efmigrationshistory
DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela sasbinf.__efmigrationshistory: ~1 rows (aproximadamente)
DELETE FROM `__efmigrationshistory`;
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
	('20250505012455_sasbinf', '8.0.13');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
