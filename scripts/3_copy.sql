CREATE OR REPLACE FUNCTION enforce_unit_hierarchy()
RETURNS trigger AS $$
DECLARE
    parent_level int;
    level int;
BEGIN
    IF NEW.parent_unit_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT ul.level INTO level
    FROM unit_levels ul
    WHERE id = NEW.unit_level_id;

    SELECT ul.level INTO parent_level
    FROM units
    JOIN unit_levels ul ON units.unit_level_id = ul.id
    WHERE units.id = NEW.parent_unit_id;


    IF parent_level IS NULL THEN
        RAISE EXCEPTION 'Parent unit % does not exist', NEW.parent_unit_id;
    END IF;

    IF parent_level <> level - 1 THEN
        RAISE EXCEPTION
            'Invalid hierarchy: parent level %, new unit level % (expected parent level %)',
            parent_level, level, level - 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_unit_level ON units;
CREATE TRIGGER check_unit_level
    BEFORE INSERT ON units
    FOR EACH ROW
    EXECUTE FUNCTION enforce_unit_hierarchy();

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('TRUNCATE TABLE %I CASCADE;', r.tablename);
    END LOOP;
END $$;


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
    value_int,
    value_text,
    value_float,
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

CREATE TABLE IF NOT EXISTS units_structure_staging(
    id INT PRIMARY KEY,
    name VARCHAR(100),
    parent_unit_id INT,
    location_id INT,
    unit_level_id INT
);

COPY units_structure_staging
FROM
    '/import/units.csv'
    CSV HEADER;

INSERT INTO units(id, name, parent_unit_id, location_id, unit_level_id)
SELECT uss.id, uss.name, uss.parent_unit_id, uss.location_id, uss.unit_level_id
FROM units_structure_staging uss;

DROP TABLE units_structure_staging;

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
    current_rank_id
)
FROM
    '/import/servicemen.csv'
WITH
    (FORMAT csv, HEADER true);

COPY rank_attribute_values (
    rank_id,
    attribute_id,
    serviceman_id,
    value_int,
    value_text,
    value_float,
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

COPY unit_members (
    assigned_at,
    discharged_at,
    role,
    unit_id,
    serviceman_id
)
FROM
    '/import/unit_members.csv'
WITH
    (FORMAT csv, HEADER true);