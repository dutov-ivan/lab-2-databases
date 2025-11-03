import type { LocationRow } from "../locations/generate.ts";
import { saveAsCsv } from "../utils/file.ts";
import { type GeneratedUnitLevel } from "./data.ts";
import {
  generateUnitLevels,
  generateUnitsWithoutCaptain as generateUnits,
  type UnitLevelRow,
} from "./generate.ts";

export const writeUnitLevels = (levels: GeneratedUnitLevel[]) => {
  const transformedLevels = generateUnitLevels(levels);
  saveAsCsv(transformedLevels, {
    quotedColumns: ["name", "description"],
    producesFile: true,
    filename: "unit_levels.csv",
  });

  return transformedLevels;
};

export const writeUnits = (
  levels: UnitLevelRow[],
  locations: LocationRow[]
) => {
  const units = generateUnits(100, levels, locations);
  saveAsCsv(units, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "units.csv",
  });
  return units;
};
