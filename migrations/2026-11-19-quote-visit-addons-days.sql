-- OANK Cleaning quote per-visit price, add-ons, and preferred days migration
-- Run once against the production database after 2026-11-18-quote-frequency-savings.sql.

ALTER TABLE `enquiries`
  ADD COLUMN `price_per_visit` DECIMAL(10,2) DEFAULT NULL COMMENT 'Discounted price per scheduled visit' AFTER `savings_amount`,
  ADD COLUMN `add_ons` VARCHAR(255) DEFAULT NULL COMMENT 'Selected optional cleaning add-ons' AFTER `frequency_discount_rate`,
  ADD COLUMN `preferred_days` VARCHAR(255) DEFAULT NULL COMMENT 'Preferred cleaning days' AFTER `add_ons`;
