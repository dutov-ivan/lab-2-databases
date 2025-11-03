-- Стосується військовослужбовця
CREATE TYPE service_type AS ENUM (
    'conscription', -- строкова служба
    'contract', -- контрактна служба
    'mobilized', -- служба за призовом під час мобілізації
    'officer_draft', -- офіцерська служба за призовом
    'reserve', -- служба в резерві
    'volunteer', -- доброволець / тероборона
    'other' -- інші (для спецслужб, місій тощо)
);

CREATE TABLE
    servicemen (
        id SERIAL PRIMARY KEY,
        last_name VARCHAR(100) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        date_of_birth DATE NOT NULL,
        sex CHAR(1) CHECK (sex IN ('M', 'F')),
        service_type service_type NOT NULL,
        enlistment_date DATE NOT NULL,
        discharge_date DATE,
        phone_number VARCHAR(15) UNIQUE,
        email VARCHAR(100) UNIQUE,
        current_rank_id BIGINT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

ALTER TABLE servicemen ADD CONSTRAINT chk_dates CHECK (
    discharge_date IS NULL
    OR discharge_date >= enlistment_date
);

ALTER TABLE servicemen ADD CONSTRAINT chk_names CHECK (
    last_name <> ''
    AND first_name <> ''
);

ALTER TABLE servicemen ADD CONSTRAINT date_of_birth_check CHECK (date_of_birth <= CURRENT_DATE);

ALTER TABLE servicemen ADD CONSTRAINT chk_phone_number_format CHECK (
    phone_number SIMILAR TO '(\+?[0-9]{7,15})'
    OR phone_number IS NULL
);

ALTER TABLE servicemen ADD CONSTRAINT chk_email_format CHECK (
    email SIMILAR TO '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
    OR email IS NULL
);

-- Стосується військових спеціальностей
CREATE TABLE
    military_specialty_categories (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        code VARCHAR(10) NOT NULL UNIQUE,
        parent_category_id BIGINT
    );

ALTER TABLE military_specialty_categories ADD CONSTRAINT chk_msc_name CHECK (military_specialty_categories.name <> '');

CREATE TABLE
    military_specialties (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        code VARCHAR(10) NOT NULL UNIQUE,
        category_id BIGINT
    );

ALTER TABLE military_specialties ADD CONSTRAINT chk_ms_name CHECK (military_specialties.name <> '');

CREATE TABLE
    servicemen_specialties (
        serviceman_id BIGINT,
        specialty_id BIGINT,
        attained_at DATE NOT NULL,
        proficiency_level INT NOT NULL,
        PRIMARY KEY (serviceman_id, specialty_id)
    );

ALTER TABLE servicemen_specialties ADD CONSTRAINT chk_proficiency_level CHECK (proficiency_level BETWEEN 1 AND 5);

-- Стосується звань
CREATE TABLE
    ranks (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) DEFAULT NULL,
        category_id BIGINT,
        rank_value INT NOT NULL
    );

ALTER TABLE ranks ADD CONSTRAINT chk_ranks_name CHECK (ranks.name <> '');

ALTER TABLE ranks ADD CONSTRAINT chk_rank_value CHECK (ranks.rank_value >= 0);

ALTER TABLE ranks ADD CONSTRAINT chk_description_nonempty CHECK (
    description IS NULL
    OR LENGTH (TRIM(description)) > 0
);

CREATE TABLE
    rank_categories (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) DEFAULT NULL,
        min_rank INT NOT NULL,
        max_rank INT NOT NULL
    );

ALTER TABLE rank_categories ADD CONSTRAINT chk_min_rank CHECK (rank_categories.min_rank >= 0);

ALTER TABLE rank_categories ADD CONSTRAINT chk_max_rank CHECK (rank_categories.max_rank >= 0);

ALTER TABLE rank_categories ADD CONSTRAINT chk_min_rank_leq_max CHECK (
    rank_categories.min_rank <= rank_categories.max_rank
);

ALTER TABLE rank_categories ADD CONSTRAINT chk_description_nonempty CHECK (
    description IS NULL
    OR LENGTH (TRIM(description)) > 0
);

ALTER TABLE rank_categories ADD CONSTRAINT chk_name CHECK (rank_categories.name <> '');

CREATE TYPE attribute_type AS ENUM ('INT', 'STRING', 'BOOL', 'DATE', 'FLOAT');

CREATE TABLE
    rank_attributes (
        id BIGINT PRIMARY KEY,
        attribute_name VARCHAR(100) NOT NULL,
        attribute_type attribute_type NOT NULL,
        is_enum BOOLEAN NOT NULL,
        is_mandatory BOOLEAN NOT NULL,
        unit_id BIGINT NULL,
        description VARCHAR(255) NULL,
        enum_values JSONB NULL,
        measurement_unit_id BIGINT NULL
    );

ALTER TABLE rank_attributes ADD CONSTRAINT chk_attribute_name CHECK (rank_attributes.attribute_name <> '');

ALTER TABLE rank_attributes ADD CONSTRAINT chk_enum_values_spec CHECK (
    NOT is_enum
    OR enum_values IS NOT NULL
);

CREATE TABLE
    ranks_rank_attributes (
        rank_id BIGINT NOT NULL,
        rank_attribute_id BIGINT NOT NULL
    );

ALTER TABLE ranks_rank_attributes ADD CONSTRAINT pk_ranks_rank_attributes PRIMARY KEY (rank_id, rank_attribute_id);

CREATE TABLE
    rank_attribute_values (
        rank_id BIGINT NOT NULL,
        attribute_id BIGINT NOT NULL,
        serviceman_id BIGINT NOT NULL,
        value_int INT,
        value_text TEXT,
        value_float NUMERIC(18, 5),
        value_boolean BOOLEAN,
        value_date DATE,
        PRIMARY KEY (attribute_id, serviceman_id, rank_id)
    );

ALTER TABLE rank_attribute_values ADD CONSTRAINT chk_one_value_type CHECK (
    (
        CASE
            WHEN value_int IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_text IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_float IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_boolean IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_date IS NOT NULL THEN 1
            ELSE 0
        END
    ) = 1
);

ALTER TABLE rank_attribute_values ADD CONSTRAINT chk_date_value_positive CHECK (
    value_date IS NULL
    OR value_date >= '1900-01-01'
);

-- Стосується підрозділів
CREATE TABLE
    units (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        parent_unit_id BIGINT,
        location_id BIGINT NOT NULL,
        unit_level_id BIGINT NOT NULL
    );

CREATE TYPE unit_member_role AS ENUM ('MEMBER', 'COMMANDER');

CREATE TABLE
    unit_members (
        unit_id BIGINT NOT NULL,
        serviceman_id BIGINT NOT NULL,
        assigned_at DATE NOT NULL,
        discharged_at DATE,
        role unit_member_role NOT NULL,
        PRIMARY KEY (unit_id, serviceman_id)
    );

ALTER TABLE unit_members ADD CONSTRAINT chk_unit_member_dates CHECK (
    discharged_at IS NULL
    OR discharged_at >= assigned_at
);

ALTER TABLE unit_members ADD CONSTRAINT chk_assigned_before_now CHECK (assigned_at <= CURRENT_DATE);

ALTER TABLE units ADD CONSTRAINT chk_units_name CHECK (units.name <> '');

CREATE TABLE
    unit_levels (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) DEFAULT NULL,
        level INT NOT NULL
    );

ALTER TABLE unit_levels ADD CONSTRAINT chk_level CHECK (unit_levels.level >= 0);

ALTER TABLE unit_levels ADD CONSTRAINT chk_name CHECK (unit_levels.name <> '');

ALTER TABLE unit_levels ADD CONSTRAINT chk_description_nonempty CHECK (
    description IS NULL
    OR LENGTH (TRIM(description)) > 0
);

CREATE TABLE
    locations (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        longitude DECIMAL(9, 6) NOT NULL,
        latitude DECIMAL(9, 6) NOT NULL
    );

ALTER TABLE locations ADD CONSTRAINT chk_name CHECK (locations.name <> '');

ALTER TABLE locations ADD CONSTRAINT chk_longitude_range CHECK (longitude BETWEEN -180 AND 180),
ADD CONSTRAINT chk_latitude_range CHECK (latitude BETWEEN -90 AND 90);

CREATE TABLE
    measurement_units (
        id BIGINT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        abbreviation VARCHAR(10) NOT NULL UNIQUE
    );

CREATE TABLE
    munition_categories (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        is_transport BOOLEAN NOT NULL,
        description TEXT DEFAULT NULL
    );

ALTER TABLE munition_categories ADD CONSTRAINT chk_name CHECK (munition_categories.name <> '');

CREATE TABLE
    munition_category_attributes (
        id BIGINT PRIMARY KEY,
        attribute_name VARCHAR(100) NOT NULL,
        attribute_type attribute_type NOT NULL,
        is_mandatory BOOLEAN NOT NULL,
        category_id BIGINT NOT NULL,
        description VARCHAR(255) NULL,
        is_enum BOOLEAN NOT NULL DEFAULT false,
        enum_values JSONB NULL,
        measurement_unit_id BIGINT NULL
    );

ALTER TABLE munition_category_attributes ADD CONSTRAINT chk_attribute_name CHECK (munition_category_attributes.attribute_name <> '');

ALTER TABLE munition_category_attributes ADD CONSTRAINT chk_enum_values_spec CHECK (
    NOT is_enum
    OR enum_values IS NOT NULL
);

CREATE TABLE
    munition_type_attribute_values (
        attribute_id BIGINT NOT NULL,
        munition_type_id BIGINT NOT NULL,
        value_int INT,
        value_text TEXT,
        value_float NUMERIC(18, 5),
        value_boolean BOOLEAN,
        value_date DATE,
        PRIMARY KEY (attribute_id, munition_type_id)
    );

ALTER TABLE munition_type_attribute_values ADD CONSTRAINT chk_one_value_type CHECK (
    (
        CASE
            WHEN value_int IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_text IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_float IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_boolean IS NOT NULL THEN 1
            ELSE 0
        END
    ) + (
        CASE
            WHEN value_date IS NOT NULL THEN 1
            ELSE 0
        END
    ) = 1
);

ALTER TABLE munition_type_attribute_values ADD CONSTRAINT chk_date_value_positive CHECK (
    value_date IS NULL
    OR value_date >= '1900-01-01'
);

CREATE TABLE
    munition_types (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category_id BIGINT NOT NULL,
        description TEXT DEFAULT NULL
    );

ALTER TABLE munition_types ADD CONSTRAINT chk_name CHECK (munition_types.name <> '');

CREATE TABLE
    munition_supplies (
        quantity INT NOT NULL,
        unit_id BIGINT NOT NULL,
        munition_type_id BIGINT NOT NULL,
        PRIMARY KEY (unit_id, munition_type_id)
    );

ALTER TABLE munition_supplies ADD CONSTRAINT chk_quantity CHECK (munition_supplies.quantity >= 0);