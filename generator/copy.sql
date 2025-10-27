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

COPY ranks (id, name, category_id, description, rank_value)
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