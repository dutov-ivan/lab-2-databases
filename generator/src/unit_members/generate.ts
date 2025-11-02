import type { ServicemanRow } from "../servicemen/generate";
import type { UnitLevel } from "../units/data";
import type { UnitRow } from "../units/generate";

export const assignMembersToUnits = (
  units: UnitRow[],
  levels: UnitLevel[],
  servicemen: ServicemanRow[]
) => {
  // Business rules: captains can be assigned only if they are part of some
};
