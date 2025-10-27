-- Стосується одиниць вимірювання
COPY measurement_units (id, name, abbreviation)
FROM
    '/import/measurement_units.csv'
WITH
    (FORMAT csv, HEADER true);

-- Стосується амуніції
COPY munition_categories (id, name, is_transport)
FROM
    '/import/munition_categories.csv'
WITH
    (FORMAT csv, HEADER true);

COPY munition_category_attributes (
    id,
    attribute_name,
    attribute_type,
    is_mandatory,
    category_id,
    description,
    is_enum,
    enum_values,
    measurement_unit_id
)
FROM
    '/import/munition_category_attributes.csv'
WITH
    (FORMAT csv, HEADER true);

COPY munition_types (id, name, category_id)
FROM
    '/import/munition_types.csv'
WITH
    (FORMAT csv, HEADER true);

COPY munition_type_attribute_values (
    attribute_id,
    munition_type_id,
    value_text,
    value_numeric,
    value_boolean,
    value_date
)
FROM
    '/import/munition_attribute_values.csv'
WITH
    (FORMAT csv, HEADER true);

-- Стосується звань
COPY rank_categories (id, name, description, min_rank, max_rank)
FROM
    '/import/rank_categories.csv'
WITH
    (FORMAT csv, HEADER true);

COPY ranks (id, name, description, category_id, rank_value)
FROM
    '/import/ranks.csv'
WITH
    (FORMAT csv, HEADER true);

COPY rank_attributes (
    id,
    attribute_name,
    attribute_type,
    is_enum,
    is_mandatory,
    measurement_unit_id,
    description,
    enum_values
)
FROM
    '/import/rank_attributes.csv'
WITH
    (FORMAT csv, HEADER true);

COPY ranks_rank_attributes (rank_id, rank_attribute_id)
FROM
    '/import/ranks_rank_attributes.csv'
WITH
    (FORMAT csv, HEADER true);

COPY military_specialty_categories (id, name, code, parent_category_id)
FROM
    '/import/military_specialty_categories.csv'
WITH
    (FORMAT csv, HEADER true);

COPY military_specialties (id, name, code, category_id)
FROM
    '/import/military_specialties.csv'
WITH
    (FORMAT csv, HEADER true);

COPY locations (id, name, longitude, latitude)
FROM
    '/import/locations.csv'
WITH
    (FORMAT csv, HEADER true);

COPY unit_levels (id, name, description, level)
FROM
    '/import/unit_levels.csv'
WITH
    (FORMAT csv, HEADER true);

ALTER TABLE units
DROP CONSTRAINT IF EXISTS fk_units_captain;

COPY units (
    id,
    name,
    parent_unit_id,
    captain_id,
    location_id,
    unit_level_id
)
FROM
    '/import/units.csv'
WITH
    (FORMAT csv, HEADER true);

COPY servicemen (
    id,
    first_name,
    last_name,
    middle_name,
    date_of_birth,
    sex,
    service_type,
    enlistment_date,
    discharge_date,
    phone_number,
    email,
    current_rank_id,
    unit_id
)
FROM
    '/import/servicemen.csv'
WITH
    (FORMAT csv, HEADER true);

ALTER TABLE units ADD CONSTRAINT fk_units_captain FOREIGN KEY (captain_id) REFERENCES servicemen (id);

COPY rank_attribute_values (
    rank_id,
    attribute_id,
    serviceman_id,
    value_text,
    value_numeric,
    value_boolean,
    value_date
)
FROM
    '/import/rank_attribute_values.csv'
WITH
    (FORMAT csv, HEADER true);

COPY munition_supplies (unit_id, munition_type_id, quantity)
FROM
    '/import/munition_supplies.csv'
WITH
    (FORMAT csv, HEADER true);

COPY servicemen_specialties (
    serviceman_id,
    specialty_id,
    attained_at,
    proficiency_level
)
FROM
    '/import/servicemen_specialties.csv'
WITH
    (FORMAT csv, HEADER true);