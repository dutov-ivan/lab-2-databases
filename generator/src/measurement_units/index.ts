import { saveAsCsv } from "../utils/file";
import { UNITS } from "./data";
import { generateUnitTable, type MeasurementUnitRow } from "./generate";

export const writeUnitTable = (): MeasurementUnitRow[] => {
  const physicalUnits = generateUnitTable(UNITS);
  saveAsCsv(physicalUnits, {
    producesFile: true,
    filename: "measurement_units.csv",
    quotedColumns: ["name", "abbreviation"],
  });
  return physicalUnits;
};
