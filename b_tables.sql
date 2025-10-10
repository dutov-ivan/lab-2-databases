-- Стосується військовослужбовця

CREATE TYPE service_type AS ENUM (
  'conscription',         -- строкова служба
  'contract',             -- контрактна служба
  'mobilized',            -- служба за призовом під час мобілізації
  'officer_draft',        -- офіцерська служба за призовом
  'reserve',              -- служба в резерві
  'volunteer',            -- доброволець / тероборона
  'other'                 -- інші (для спецслужб, місій тощо)
);


CREATE TABLE  servicemen (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    sex CHAR(1) CHECK (sex IN ('M', 'F')),
    service_type service_type NOT NULL,
    enlistment_date DATE NOT NULL,
    discharge_date DATE,
    phone VARCHAR(15),
    email VARCHAR(100),
    current_rank_id BIGINT,
    unit_id BIGINT
);

ALTER TABLE servicemen
ADD CONSTRAINT chk_dates CHECK (discharge_date IS NULL OR discharge_date >= enlistment_date);

ALTER TABLE servicemen
ADD CONSTRAINT chk_names CHECK (last_name <> '' AND first_name <> '');

ALTER TABLE servicemen
ADD CONSTRAINT date_of_birth_check CHECK (date_of_birth <= CURRENT_DATE);

ALTER TABLE servicemen
ADD CONSTRAINT chk_phone_format
CHECK (
    phone ~ '^(\+?\d{7,15})$' OR phone IS NULL
);

ALTER TABLE servicemen
ADD CONSTRAINT chk_email_format
CHECK (
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL
);

-- Стосується військових спеціальностей

CREATE TABLE  military_specialty_categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

ALTER TABLE military_specialty_categories
ADD CONSTRAINT chk_msc_name CHECK (military_specialty_categories.name <> '');

CREATE TABLE  military_specialties (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category_id BIGINT
);

ALTER TABLE military_specialties
ADD CONSTRAINT chk_ms_name CHECK (military_specialties.name <> '');

-- Стосується звань

CREATE TABLE  ranks (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    category_id BIGINT
);

ALTER TABLE ranks 
ADD CONSTRAINT chk_ranks_name CHECK (ranks.name <> '');

CREATE TABLE  rank_categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    max_organizational_level INT NOT NULL
);

ALTER TABLE rank_categories
ADD CONSTRAINT chk_max_organizational_level CHECK (rank_categories.max_organizational_level >= 0);

ALTER TABLE rank_categories
ADD CONSTRAINT chk_name CHECK (rank_categories.name <> '');

CREATE TYPE  attribute_type AS ENUM ('STRING', 'INTEGER', 'BOOLEAN', 'DATE');

CREATE TABLE  rank_attributes(
    id BIGINT PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_type attribute_type NOT NULL,
    is_mandatory BOOLEAN NOT NULL,
    rank_id BIGINT NOT NULL
);

ALTER TABLE rank_attributes
ADD CONSTRAINT chk_attribute_name CHECK (rank_attributes.attribute_name <> '');

CREATE TABLE  rank_attribute_values(
    id BIGINT PRIMARY KEY,
    value VARCHAR(100) NOT NULL,
    attribute_id BIGINT NOT NULL,
    serviceman_id BIGINT NOT NULL
);

-- Стосується підрозділів
CREATE TABLE  units (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_unit_id BIGINT,
    captain_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    organizational_level_id BIGINT NOT NULL
);

ALTER TABLE units
ADD CONSTRAINT chk_units_name CHECK (units.name <> '');

CREATE TABLE  organizational_levels (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    level INT NOT NULL
);

ALTER TABLE organizational_levels
ADD CONSTRAINT chk_level CHECK (organizational_levels.level >= 0);

ALTER TABLE organizational_levels
ADD CONSTRAINT chk_name CHECK (organizational_levels.name <> '');

CREATE TABLE  locations (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    longitude DECIMAL(9,6) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL
);

ALTER TABLE locations
ADD CONSTRAINT chk_name CHECK (locations.name <> '');

ALTER TABLE locations
ADD CONSTRAINT chk_longitude_range CHECK (longitude BETWEEN -180 AND 180),
ADD CONSTRAINT chk_latitude_range CHECK (latitude BETWEEN -90 AND 90);


CREATE TABLE  ammunition_types (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

ALTER TABLE ammunition_types
ADD CONSTRAINT chk_name CHECK (ammunition_types.name <> '');


CREATE TABLE  ammunition_supplies (
    id BIGINT PRIMARY KEY,
    quantity INT NOT NULL,
    unit_id BIGINT NOT NULL,
    ammunition_type_id BIGINT NOT NULL
);

ALTER TABLE ammunition_supplies
ADD CONSTRAINT chk_quantity CHECK (ammunition_supplies.quantity >= 0);

CREATE TABLE  ammunition_categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_transport BOOLEAN NOT NULL
);

ALTER TABLE ammunition_categories
ADD CONSTRAINT chk_name CHECK (ammunition_categories.name <> '');

CREATE TABLE  ammunition_category_attributes(
    id BIGINT PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_type attribute_type NOT NULL,
    is_mandatory BOOLEAN NOT NULL,
    category_id BIGINT NOT NULL
);

ALTER TABLE ammunition_category_attributes
ADD CONSTRAINT chk_attribute_name CHECK (ammunition_category_attributes.attribute_name <> '');

CREATE TABLE  ammunition_category_attribute_values(
    id BIGINT PRIMARY KEY,
    value VARCHAR(100) NOT NULL,
    attribute_id BIGINT NOT NULL,
    ammunition_type_id BIGINT NOT NULL
);

