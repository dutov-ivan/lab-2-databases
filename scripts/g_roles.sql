-- Roles
CREATE ROLE role_unit_commander;
CREATE ROLE role_logistics_officer;
CREATE ROLE role_hr_officer;

-- Database access
GRANT CONNECT ON DATABASE military TO role_unit_commander, role_logistics_officer, role_hr_officer;

-- Table privileges
GRANT SELECT ON servicemen, ranks, units, munition_supplies, munition_categories, munition_types TO role_unit_commander;
GRANT UPDATE ON units, munition_supplies TO role_unit_commander;

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE munition_supplies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY policy_unit_change ON units
    FOR SELECT, UPDATE TO role_unit_commander
    USING (unit_id = current_setting('app.current_unit')::BIGINT)
    WITH CHECK (unit_id = current_setting('app.current_unit')::BIGINT);

CREATE POLICY policy_munition_supplies_change ON munition_supplies
    FOR SELECT, UPDATE TO role_unit_commander
    USING (unit_id = current_setting('app.current_unit')::BIGINT)
    WITH CHECK (unit_id = current_setting('app.current_unit')::BIGINT);
