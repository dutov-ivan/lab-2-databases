-- 1) servicemen: додати emergency_contact_phone (NOT NULL + DEFAULT '') та перевірку формату
ALTER TABLE servicemen
	ADD COLUMN emergency_contact_phone VARCHAR(15) NOT NULL DEFAULT '';
ALTER TABLE servicemen
	ADD CONSTRAINT chk_emergency_contact_phone_format
		CHECK (emergency_contact_phone = '' OR emergency_contact_phone ~ '^(\\+?\\d{7,15})$' OR emergency_contact_phone ~ '^\\+?\\d{7,15}$');

-- 2) servicemen: збільшити довжину email
ALTER TABLE servicemen
	ALTER COLUMN email TYPE VARCHAR(150);

-- 3) ranks: зробити category_id NOT NULL (посилання на категорію обов'язкове)
ALTER TABLE ranks
	ALTER COLUMN category_id SET NOT NULL;


-- 4) rank_attributes: унікальність пари (rank_id, attribute_name)
ALTER TABLE rank_attributes
	ADD CONSTRAINT uq_rank_attributes_rank_attr UNIQUE (rank_id, attribute_name);

-- 5) units: додати created_at NOT NULL з DEFAULT поточний час
ALTER TABLE units
	ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

-- 6) organizational_levels: змінити тип level на SMALLINT (економія пам'яті)
ALTER TABLE organizational_levels
	ALTER COLUMN level TYPE SMALLINT;

-- 7) munition_supplies: встановити DEFAULT 0 для quantity
ALTER TABLE munition_supplies
	ALTER COLUMN quantity SET DEFAULT 0;

-- 8) munition_supplies: верхня межа для quantity
ALTER TABLE munition_supplies
	ADD CONSTRAINT chk_quantity_upper_bound CHECK (quantity <= 1000000);

-- 9) locations: унікальність пари координат (longitude, latitude)
ALTER TABLE locations
	ADD CONSTRAINT uq_locations_coords UNIQUE (longitude, latitude);

-- 10) servicemen: перевірка що дата народження не в майбутньому
ALTER TABLE servicemen
    ADD CONSTRAINT chk_servicemen_dob_not_future CHECK (date_of_birth <= CURRENT_DATE);