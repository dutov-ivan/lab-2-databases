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

-- 4. Видалення самопосилального FOREIGN KEY (ієрархія підрозділів)
ALTER TABLE units
	DROP CONSTRAINT fk_units_parent;

-- 5. Видалення UNIQUE-обмеження (композиційного) для прикладу
ALTER TABLE rank_attribute_values
	DROP CONSTRAINT uq_rank_attribute_values;

-- 6. Видалення CHECK-обмеження на максимальний організаційний рівень
ALTER TABLE rank_categories
	DROP CONSTRAINT chk_max_organizational_level;

-- 7. Видалення FOREIGN KEY між постачанням амуніції та підрозділом
ALTER TABLE ammunition_supplies
	DROP CONSTRAINT fk_ammunition_supplies_unit;

-- 8. Видалення FOREIGN KEY (зв'язок значень атрибутів звання та військовослужбовця)
ALTER TABLE rank_attribute_values
	DROP CONSTRAINT fk_rank_attribute_values_serviceman;

-- 9. Видалення FOREIGN KEY (зв'язок значень атрибутів категорій амуніції з типом амуніції)
ALTER TABLE ammunition_category_attribute_values
	DROP CONSTRAINT fk_ammunition_category_attribute_values_ammunition_type;

-- 10. Видалення одного з географічних CHECK-обмежень (довгота)
ALTER TABLE locations
	DROP CONSTRAINT chk_longitude_range;

-- Повертаємося до вихідного стану схеми
ROLLBACK;
