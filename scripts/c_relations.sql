-- Стосується військовослужбовців
ALTER TABLE servicemen ADD CONSTRAINT fk_servicemen_rank FOREIGN KEY (current_rank_id) REFERENCES ranks (id);

-- Додаємо зовнішній ключ, який потім видалимо
ALTER TABLE equipment_assignments
ADD CONSTRAINT fk_equip_serviceman
    FOREIGN KEY (serviceman_id)
    REFERENCES servicemen (id);

-- Стосується військових спеціальностей
ALTER TABLE military_specialties ADD CONSTRAINT fk_military_specialties_category FOREIGN KEY (category_id) REFERENCES military_specialty_categories (id);

ALTER TABLE military_specialty_categories ADD CONSTRAINT fk_military_specialty_categories_parent FOREIGN KEY (parent_category_id) REFERENCES military_specialty_categories (id);

ALTER TABLE servicemen_specialties ADD CONSTRAINT fk_servicemen_specialties_serviceman FOREIGN KEY (serviceman_id) REFERENCES servicemen (id);

ALTER TABLE servicemen_specialties ADD CONSTRAINT fk_servicemen_specialties_specialty FOREIGN KEY (specialty_id) REFERENCES military_specialties (id);

-- Стосується звань
ALTER TABLE ranks ADD CONSTRAINT fk_ranks_category FOREIGN KEY (category_id) REFERENCES rank_categories (id);

ALTER TABLE rank_attributes ADD CONSTRAINT fk_rank_attributes_measurement_unit FOREIGN KEY (measurement_unit_id) REFERENCES measurement_units (id);

ALTER TABLE ranks_rank_attributes ADD CONSTRAINT rank_id_fk FOREIGN KEY (rank_id) REFERENCES ranks (id);

ALTER TABLE ranks_rank_attributes ADD CONSTRAINT rank_attribute_id_fk FOREIGN KEY (rank_attribute_id) REFERENCES rank_attributes (id);

ALTER TABLE rank_attribute_values ADD CONSTRAINT fk_rank_attribute_values_rank FOREIGN KEY (rank_id) REFERENCES ranks (id);

ALTER TABLE rank_attribute_values ADD CONSTRAINT fk_rank_attribute_values_attribute FOREIGN KEY (attribute_id) REFERENCES rank_attributes (id);

ALTER TABLE rank_attribute_values ADD CONSTRAINT fk_rank_attribute_values_serviceman FOREIGN KEY (serviceman_id) REFERENCES servicemen (id);

ALTER TABLE rank_attribute_values ADD CONSTRAINT uq_rank_attribute_values UNIQUE (attribute_id, serviceman_id);

-- Стосується підрозділів
ALTER TABLE units ADD CONSTRAINT fk_units_parent FOREIGN KEY (parent_unit_id) REFERENCES units (id);

ALTER TABLE units ADD CONSTRAINT fk_units_location FOREIGN KEY (location_id) REFERENCES locations (id);

ALTER TABLE units ADD CONSTRAINT fk_units_unit_level FOREIGN KEY (unit_level_id) REFERENCES unit_levels (id);

ALTER TABLE unit_members ADD CONSTRAINT fk_unit_members_unit FOREIGN KEY (unit_id) REFERENCES units (id);

ALTER TABLE unit_members ADD CONSTRAINT fk_unit_members_serviceman FOREIGN KEY (serviceman_id) REFERENCES servicemen (id);

-- Стосується амуніції
ALTER TABLE munition_types ADD CONSTRAINT fk_munition_types_munition_category FOREIGN KEY (category_id) REFERENCES munition_categories (id);

ALTER TABLE munition_supplies ADD CONSTRAINT fk_munition_supplies_unit FOREIGN KEY (unit_id) REFERENCES units (id);

ALTER TABLE munition_supplies ADD CONSTRAINT fk_munition_supplies_munition_type FOREIGN KEY (munition_type_id) REFERENCES munition_types (id);

ALTER TABLE munition_category_attributes ADD CONSTRAINT fk_munition_category_attributes_category FOREIGN KEY (category_id) REFERENCES munition_categories (id);

ALTER TABLE munition_category_attributes ADD CONSTRAINT fk_munition_category_attributes_measurement_unit FOREIGN KEY (measurement_unit_id) REFERENCES measurement_units (id);

ALTER TABLE munition_type_attribute_values ADD CONSTRAINT fk_munition_type_attribute_values_attribute FOREIGN KEY (attribute_id) REFERENCES munition_category_attributes (id);

ALTER TABLE munition_type_attribute_values ADD CONSTRAINT fk_munition_type_attribute_values_munition_type FOREIGN KEY (munition_type_id) REFERENCES munition_types (id);

ALTER TABLE munition_type_attribute_values ADD CONSTRAINT uq_munition_type_attribute_values UNIQUE (attribute_id, munition_type_id);