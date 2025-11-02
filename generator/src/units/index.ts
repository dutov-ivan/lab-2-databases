import type { LocationRow } from "../locations/generate";
import { saveAsCsv } from "../utils/file";
import { UNIT_LEVELS, type UnitLevel } from "./data";
import { generateUnitsWithoutCaptain as generateUnits } from "./generate";

export const writeUnitLevels = () => {
  saveAsCsv(UNIT_LEVELS, {
    quotedColumns: ["name", "description"],
    producesFile: true,
    filename: "unit_levels.csv",
  });
};

export const writeUnits = (levels: UnitLevel[], locations: LocationRow[]) => {
  const units = generateUnits(100, levels, locations);
  saveAsCsv(units, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "units.csv",
  });
};
