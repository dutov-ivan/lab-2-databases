-- 1) servicemen: додати emergency_contact_phone_number
ALTER TABLE servicemen
ADD COLUMN emergency_contact_phone_number VARCHAR(15) NULL;

-- 2) servicemen: додати перевірку формату екстренного номеру телефону
ALTER TABLE servicemen ADD CONSTRAINT chk_emergency_contact_phone_number_format CHECK (
	emergency_contact_phone_number IS NULL
	OR emergency_contact_phone_number SIMILAR TO '\\+?[0-9]{7,15}'
);

-- 3) servicemen: зменшити довжину email (із 100)
ALTER TABLE servicemen
ALTER COLUMN email TYPE VARCHAR(75);

-- 4) units: додати created_at NOT NULL з DEFAULT поточний час
ALTER TABLE units
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW ();

-- 5) unit_levels: змінити тип level на SMALLINT (економія пам'яті)
ALTER TABLE unit_levels
ALTER COLUMN level TYPE SMALLINT;

-- 6) munition_supplies: верхня межа для quantity
ALTER TABLE munition_supplies ADD CONSTRAINT chk_quantity_upper_bound CHECK (quantity <= 1000000);

-- 7) locations: унікальність пари координат (longitude, latitude)
ALTER TABLE locations ADD CONSTRAINT uq_locations_coords UNIQUE (longitude, latitude);

-- 8) Додання військовослужбовцю рівня володіння спеціальністю
ALTER TABLE servicemen_specialties
    ADD COLUMN proficiency_level INT NOT NULL DEFAULT(3);

ALTER TABLE servicemen_specialties
    ADD CONSTRAINT chk_proficiency_level CHECK (proficiency_level BETWEEN 1 AND 5);

-- 9) Додання ENUM як можливої репрезентації rank_attributes
ALTER TABLE rank_attributes
ADD COLUMN is_enum BOOLEAN NOT NULL DEFAULT(false),
ADD COLUMN enum_values JSONB NULL;

ALTER TABLE rank_attributes ADD CONSTRAINT chk_enum_values_spec CHECK (
    NOT is_enum
    OR enum_values IS NOT NULL
);

-- 10) Навряд чи в значеннях атрибутів рангів та амуніції знайдуться від'ємні числа
ALTER TABLE rank_attribute_values
    ADD CONSTRAINT chk_value_int CHECK (value_int >= 0);

ALTER TABLE munition_type_attribute_values
    ADD CONSTRAINT chk_value_int CHECK (value_int >= 0);
