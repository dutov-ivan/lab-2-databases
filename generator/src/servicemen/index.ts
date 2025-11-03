import type { MilitarySpecialtyTables } from "../military_specialties/generate.ts";
import { saveAsCsv } from "../utils/file.ts";
import {
  assignSpecialtiesToServicemen,
  generateServicemen,
  type ServicemanRow,
} from "./generate.ts";

export const getServicemenData = () => {
  const servicemen = generateServicemen(1000);

  return servicemen;
};

export const writeServicemenSpecialties = (
  militarySpecialtyTables: MilitarySpecialtyTables,
  servicemen: ServicemanRow[]
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

export const writeServicemen = (servicemen: ServicemanRow[]) => {
  saveAsCsv(servicemen, {
    quotedColumns: [
      "firstName",
      "lastName",
      "middleName",
      "phoneNumber",
      "email",
    ],
    producesFile: true,
    filename: "servicemen.csv",
  });
};
