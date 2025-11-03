-- 1) [Drop FK] Видалення зовнішнього ключа з 'equipment_assignments'
ALTER TABLE equipment_assignments
DROP CONSTRAINT IF EXISTS fk_equip_serviceman;

-- 2) [Drop Index / Unique] Видалення унікального індексу
DROP INDEX IF EXISTS uq_equip_tag;

-- 3) [Drop CHECK] Видалення CHECK обмеження з 'equipment_assignments'
ALTER TABLE equipment_assignments
DROP CONSTRAINT IF EXISTS chk_equip_quantity;

-- 4) [Drop Table] Видалення самої таблиці 'equipment_assignments'
DROP TABLE IF EXISTS equipment_assignments;

-- 5) [Drop CHECK] Видалення CHECK формату 'emergency_contact_phone_number'
ALTER TABLE servicemen
DROP CONSTRAINT IF EXISTS chk_emergency_contact_phone_number_format;

-- 6) [Drop COLUMN] Видалення стовпця 'emergency_contact_phone_number'
ALTER TABLE servicemen
DROP COLUMN IF EXISTS emergency_contact_phone_number;

-- 7) [Drop CHECK] Видалення CHECK обмеження з 'munition_supplies'
ALTER TABLE munition_supplies
DROP CONSTRAINT IF EXISTS chk_quantity_upper_bound;

-- 8) [Drop UNIQUE] Видалення UNIQUE обмеження з 'locations'
ALTER TABLE locations
DROP CONSTRAINT IF EXISTS uq_locations_coords;

-- 9) [Drop CHECK] Видалення CHECK (невід'ємне значення) з 'rank_attribute_values'
ALTER TABLE rank_attribute_values
DROP CONSTRAINT IF EXISTS chk_value_int;

-- 10) [Drop CHECK] Видалення CHECK (невід'ємне значення) з 'munition_type_attribute_values'
-- (Це ви додали у п.10)
ALTER TABLE munition_type_attribute_values
DROP CONSTRAINT IF EXISTS chk_value_int;