COPY munition_categories (id, name, is_transport)
FROM '/import/munition_categories.csv'
WITH (FORMAT csv, HEADER true);

COPY physical_units (id, name, abbreviation)
FROM '/import/physical_units.csv'
WITH (FORMAT csv, HEADER true);

COPY munition_category_attributes (id, attribute_name, attribute_type, is_mandatory, category_id, description, is_enum, enum_values, physical_unit_id) 
FROM '/import/munition_category_attributes.csv'
WITH (FORMAT csv, HEADER true);

COPY munition_types (id, name, category_id) 
FROM '/import/munition_types.csv'
WITH (FORMAT csv, HEADER true);
