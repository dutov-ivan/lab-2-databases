import { saveAsCsv } from "../utils/file.ts";
import { UNITS } from "./data.ts";
import { generateUnitTable, type MeasurementUnitRow } from "./generate.ts";

export const writeUnitTable = (): MeasurementUnitRow[] => {
  const physicalUnits = generateUnitTable(UNITS);
  saveAsCsv(physicalUnits, {
    producesFile: true,
    filename: "measurement_units.csv",
    quotedColumns: ["name", "abbreviation"],
  });
  return physicalUnits;
};
