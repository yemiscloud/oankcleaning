-- OANK Cleaning quote form additions
-- Run once against the production database before deploying the updated PHP API.
-- Adds the £25 living/dining room option and customer-supplied materials discount.

ALTER TABLE enquiries
  ADD COLUMN living_room_dining_room TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Selected £25 living room/dining room add-on',
  ADD COLUMN materials_discount_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '10 percent discount when customer supplies cleaning materials/equipment';
