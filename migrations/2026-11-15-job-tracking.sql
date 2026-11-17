-- OANK Cleaning job tracking migration. Run once before deploying new endpoints.
ALTER TABLE `enquiries`
  ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT NULL AFTER `created_at`,
  ADD COLUMN `delivered_at` TIMESTAMP NULL DEFAULT NULL AFTER `updated_at`;

CREATE TABLE IF NOT EXISTS `job_status_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, `enquiry_id` INT(11) NOT NULL,
  `old_status` VARCHAR(50) NOT NULL, `new_status` VARCHAR(50) NOT NULL,
  `changed_by` VARCHAR(255) NOT NULL, `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_job_history_enquiry` (`enquiry_id`), KEY `idx_job_history_changed_at` (`changed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_admin_otp` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, `ip_hash` CHAR(64) NOT NULL,
  `purpose` VARCHAR(24) NOT NULL, `enquiry_id` INT(11) DEFAULT NULL,
  `otp_hash` VARCHAR(255) NOT NULL, `expires_at` DATETIME NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), KEY `idx_job_otp_ip_purpose` (`ip_hash`, `purpose`, `created_at`), KEY `idx_job_otp_expiry` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
