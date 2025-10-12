BEGIN;

-- 1. Видалення CHECK-обмеження формату телефону
ALTER TABLE servicemen
	DROP CONSTRAINT chk_phone_format;

-- 2. Видалення CHECK-обмеження формату email перед дропом стовпця
ALTER TABLE servicemen
	DROP CONSTRAINT chk_email_format;

-- 3. Видалення стовпця email (після видалення залежного CHECK)
ALTER TABLE servicemen
	DROP COLUMN email;

-- 4. Видалення UNIQUE-обмеження (композиційного) для прикладу
ALTER TABLE rank_attribute_values
	DROP CONSTRAINT uq_rank_attribute_values;

-- 5. Видалення CHECK-обмеження на максимальний організаційний рівень
ALTER TABLE rank_categories
	DROP CONSTRAINT chk_max_organizational_level;


-- 6. Видалення FOREIGN KEY (зв'язок значень атрибутів звання та військовослужбовця)
ALTER TABLE rank_attribute_values
	DROP CONSTRAINT fk_rank_attribute_values_serviceman;

-- 7. Видалення одного з географічних CHECK-обмежень (довгота)
ALTER TABLE locations
	DROP CONSTRAINT chk_longitude_range;

COMMIT;