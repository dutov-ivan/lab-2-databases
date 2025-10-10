-- Стосується військовослужбовців
ALTER TABLE servicemen
ADD CONSTRAINT fk_servicemen_rank
FOREIGN KEY (current_rank_id)
REFERENCES ranks(id);

ALTER TABLE servicemen
ADD CONSTRAINT fk_servicemen_unit
FOREIGN KEY (unit_id)
REFERENCES units(id);

-- Стосується військових спеціальностей

ALTER TABLE military_specialties
ADD CONSTRAINT fk_military_specialties_category
FOREIGN KEY (category_id)
REFERENCES military_specialty_categories(id);

CREATE TABLE  servicemen_specialties (
    serviceman_id BIGINT REFERENCES servicemen(id),
    specialty_id BIGINT REFERENCES military_specialties(id),
    PRIMARY KEY (serviceman_id, specialty_id)
);

-- Стосується звань

ALTER TABLE ranks
ADD CONSTRAINT fk_ranks_category
FOREIGN KEY (category_id)
REFERENCES rank_categories(id);

ALTER TABLE rank_attributes
ADD CONSTRAINT fk_rank_attributes_rank
FOREIGN KEY (rank_id)
REFERENCES ranks(id);

ALTER TABLE rank_attribute_values
ADD CONSTRAINT fk_rank_attribute_values_attribute
FOREIGN KEY (attribute_id)
REFERENCES rank_attributes(id);

ALTER TABLE rank_attribute_values
ADD CONSTRAINT fk_rank_attribute_values_serviceman
FOREIGN KEY (serviceman_id)
REFERENCES servicemen(id);

ALTER TABLE rank_attribute_values
ADD CONSTRAINT uq_rank_attribute_values
UNIQUE(attribute_id, serviceman_id);

-- Стосується підрозділів
ALTER TABLE units
ADD CONSTRAINT fk_units_parent
FOREIGN KEY (parent_unit_id)
REFERENCES units(id);

ALTER TABLE units
ADD CONSTRAINT fk_units_captain
FOREIGN KEY (captain_id)
REFERENCES servicemen(id);

ALTER TABLE units
ADD CONSTRAINT fk_units_location
FOREIGN KEY (location_id)
REFERENCES locations(id);

ALTER TABLE units
ADD CONSTRAINT fk_units_organizational_level
FOREIGN KEY (organizational_level_id)
REFERENCES organizational_levels(id);

-- Стосується амуніції

ALTER TABLE ammunition_supplies
ADD CONSTRAINT fk_ammunition_supplies_unit
FOREIGN KEY (unit_id)
REFERENCES units(id);

ALTER TABLE ammunition_supplies
ADD CONSTRAINT fk_ammunition_supplies_ammunition_type
FOREIGN KEY (ammunition_type_id)
REFERENCES ammunition_types(id);

ALTER TABLE ammunition_category_attributes
ADD CONSTRAINT fk_ammunition_category_attributes_category
FOREIGN KEY (category_id)
REFERENCES ammunition_categories(id);

ALTER TABLE ammunition_category_attribute_values
ADD CONSTRAINT fk_ammunition_category_attribute_values_attribute
FOREIGN KEY (attribute_id)
REFERENCES ammunition_category_attributes(id);

ALTER TABLE ammunition_category_attribute_values
ADD CONSTRAINT fk_ammunition_category_attribute_values_ammunition_type
FOREIGN KEY (ammunition_type_id)
REFERENCES ammunition_types(id);

ALTER TABLE ammunition_category_attribute_values
ADD CONSTRAINT uq_ammunition_category_attribute_values
UNIQUE(attribute_id, ammunition_type_id);