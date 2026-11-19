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
  `quote_estimate` decimal(10,2) DEFAULT NULL COMMENT 'Final discounted estimated total',
  `original_estimate` decimal(10,2) DEFAULT NULL COMMENT 'Undiscounted total before discounts',
  `savings_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total discount savings amount',
  `property_type` varchar(50) DEFAULT NULL COMMENT 'Property type selected in quote form',
  `bedrooms` tinyint(3) unsigned DEFAULT NULL COMMENT 'Number of bedrooms/large rooms',
  `bathrooms` tinyint(3) unsigned DEFAULT NULL COMMENT 'Number of bathrooms/toilets',
  `frequency` varchar(32) DEFAULT NULL COMMENT 'one-off, weekly, fortnightly, or monthly',
  `frequency_count` int(11) NOT NULL DEFAULT 1 COMMENT 'Number of scheduled visits selected',
  `frequency_discount_rate` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Frequency discount percentage applied (15, 10, 5, or 0)',
  `living_room_dining_room` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Selected £25 living room/dining room add-on',
  `materials_discount_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '10 percent discount when customer supplies cleaning materials/equipment',
  `status` varchar(50) NOT NULL DEFAULT 'Pending' COMMENT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `updated_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reference_no` (`reference_no`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job status audit trail
CREATE TABLE IF NOT EXISTS `job_status_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enquiry_id` INT(11) NOT NULL,
  `old_status` VARCHAR(50) NOT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `changed_by` VARCHAR(255) NOT NULL,
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_job_history_enquiry` (`enquiry_id`),
  KEY `idx_job_history_changed_at` (`changed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One-time codes for admin login and delivery confirmation
CREATE TABLE IF NOT EXISTS `job_admin_otp` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_hash` CHAR(64) NOT NULL,
  `purpose` VARCHAR(24) NOT NULL,
  `enquiry_id` INT(11) DEFAULT NULL,
  `otp_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_job_otp_ip_purpose` (`ip_hash`, `purpose`, `created_at`),
  KEY `idx_job_otp_expiry` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
