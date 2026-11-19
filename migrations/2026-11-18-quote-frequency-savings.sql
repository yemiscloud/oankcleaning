-- OANK Cleaning quote frequency count, discounts, and savings migration
-- Run once against the production database after previous migrations.

ALTER TABLE `enquiries`
  ADD COLUMN `original_estimate` DECIMAL(10,2) DEFAULT NULL COMMENT 'Undiscounted total before discounts' AFTER `quote_estimate`,
  ADD COLUMN `savings_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total discount savings amount' AFTER `original_estimate`,
  ADD COLUMN `property_type` VARCHAR(50) DEFAULT NULL COMMENT 'Property type selected in quote form' AFTER `savings_amount`,
  ADD COLUMN `bedrooms` TINYINT(3) UNSIGNED DEFAULT NULL COMMENT 'Number of bedrooms/large rooms' AFTER `property_type`,
  ADD COLUMN `bathrooms` TINYINT(3) UNSIGNED DEFAULT NULL COMMENT 'Number of bathrooms/toilets' AFTER `bedrooms`,
  ADD COLUMN `frequency` VARCHAR(32) DEFAULT NULL COMMENT 'one-off, weekly, fortnightly, or monthly' AFTER `bathrooms`,
  ADD COLUMN `frequency_count` INT(11) NOT NULL DEFAULT 1 COMMENT 'Number of scheduled visits selected' AFTER `frequency`,
  ADD COLUMN `frequency_discount_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Frequency discount percentage applied (15, 10, 5, or 0)' AFTER `frequency_count`;
