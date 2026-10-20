-- ==============================================================================
-- OANK CLEANING CIC - MySQL Database Schema
-- Database: oankxyju_cleaning
-- Compatible with MySQL 5.7+ and MariaDB 10.2+
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ------------------------------------------------------------------------------
-- Table structure for table `enquiries`
-- Stores all customer contact enquiries and instant quote requests
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(32) NOT NULL COMMENT '',
  `name` varchar(255) NOT NULL COMMENT '',
  `email` varchar(255) NOT NULL COMMENT '',
  `phone` varchar(50) DEFAULT NULL COMMENT '',
  `service` varchar(255) NOT NULL COMMENT '',
  `postcode` varchar(50) DEFAULT NULL COMMENT '',
  `preferred_date` varchar(100) DEFAULT NULL COMMENT '',
  `message` text DEFAULT NULL COMMENT '',
  `quote_estimate` decimal(10,2) DEFAULT NULL COMMENT '',
  `status` varchar(50) NOT NULL DEFAULT 'Pending' COMMENT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reference_no` (`reference_no`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
