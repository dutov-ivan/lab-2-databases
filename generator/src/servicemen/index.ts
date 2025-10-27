import type { MilitarySpecialtyTables } from "../military_specialties/generate.ts";
import { saveAsCsv } from "../utils/file.ts";
import {
  assignSpecialtiesToServicemen,
  type ServicemanWithUnit,
} from "./generate.ts";

export const writeServicemenSpecialties = (
  militarySpecialtyTables: MilitarySpecialtyTables,
  servicemen: ServicemanWithUnit[]
) => {
  const specialtyServicemenRows = assignSpecialtiesToServicemen(
    servicemen,
    militarySpecialtyTables.specialties.map((specialty) => specialty.id)
  );
  saveAsCsv(specialtyServicemenRows, {
    producesFile: true,
    filename: "servicemen_specialties.csv",
  });
};
