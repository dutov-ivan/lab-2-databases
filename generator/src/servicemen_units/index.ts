import {
  assignUnitsToServicemen,
  generateServicemenWithoutUnit,
} from "../servicemen/generate.ts";
import { UNIT_LEVELS } from "../units/data.ts";
import {
  assignCaptainsToUnits,
  generateUnitsWithoutCaptain,
} from "../units/generate.ts";
import { generateLocations } from "../units/location.ts";
import { saveAsCsv } from "../utils/file.ts";

export const writeServicemenAndUnits = (rankIds: number[]) => {
  const locations = generateLocations(50);
  const unitsWithoutCaptain = generateUnitsWithoutCaptain(
    100,
    UNIT_LEVELS,
    locations
  );
  const servicemenWithoutUnit = generateServicemenWithoutUnit(1000, rankIds);
  const servicemen = assignUnitsToServicemen(
    servicemenWithoutUnit,
    unitsWithoutCaptain.map((unit) => unit.id)
  );

  const units = assignCaptainsToUnits(unitsWithoutCaptain, servicemen);

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

  saveAsCsv(locations, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "locations.csv",
  });

  saveAsCsv(UNIT_LEVELS, {
    quotedColumns: ["name", "description"],
    producesFile: true,
    filename: "unit_levels.csv",
  });

  saveAsCsv(units, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "units.csv",
  });
};
