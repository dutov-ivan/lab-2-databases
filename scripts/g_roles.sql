-- РОЛЬ 1: personnel_clerk (Кадровик)
-- Ця роль керує особовим складом.
CREATE ROLE personnel_clerk;

-- Надаємо доступ на читання до "довідників" (підрозділи, звання, спеціальності)
GRANT SELECT ON units, ranks, rank_categories, military_specialties, military_specialty_categories, rank_attributes
TO personnel_clerk;

-- Надаємо повний доступ (включаючи INSERT, UPDATE) до таблиць, що стосуються особових справ
GRANT SELECT, INSERT, UPDATE ON servicemen, unit_members, servicemen_specialties, rank_attribute_values
TO personnel_clerk;

-- Оскільки servicemen.id є SERIAL, потрібно надати дозвіл на використання послідовності
GRANT USAGE, SELECT ON SEQUENCE servicemen_id_seq TO personnel_clerk;


-- РОЛЬ 2: logistics_officer (Логіст)
-- Ця роль керує озброєнням та припасами.
CREATE ROLE logistics_officer;

-- Надаємо повний доступ до всіх таблиць, пов'язаних з амуніцією та озброєнням
GRANT SELECT, INSERT, UPDATE, DELETE ON
    munition_categories,
    munition_types,
    munition_supplies,
    munition_category_attributes,
    munition_type_attribute_values
TO logistics_officer;

-- РОЛЬ 3: command_staff (Штаб)
-- Ця роль має доступ "лише для читання" до всієї бази даних для звітів.
CREATE ROLE command_staff;

-- Надаємо доступ на читання до ВСІХ таблиць у схемі public
GRANT SELECT ON ALL TABLES IN SCHEMA public TO command_staff;

-- Встановлюємо, щоб ця роль АВТОМАТИЧНО отримувала доступ на читання до будь-яких НОВИХ таблиць,
-- що можуть бути створені в майбутньому.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO command_staff;