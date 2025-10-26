COPY munition_categories (id, name, is_transport)
FROM '/import/munition_categories.csv'
WITH (FORMAT csv, HEADER true);

COPY measurement_units (id, name, abbreviation)
FROM '/import/measurement_units.csv'
WITH (FORMAT csv, HEADER true);

COPY munition_category_attributes (id, attribute_name, attribute_type, is_mandatory, category_id, description, is_enum, enum_values, measurement_unit_id) 
FROM '/import/munition_category_attributes.csv'
WITH (FORMAT csv, HEADER true);

COPY munition_types (id, name, category_id) 
FROM '/import/munition_types.csv'
WITH (FORMAT csv, HEADER true);

COPY munition_type_attribute_values (id, attribute_id, munition_type_id, value_text, value_numeric, value_boolean, value_date, value_jsonb) 
FROM '/import/munition_attribute_values.csv'
WITH (FORMAT csv, HEADER true);