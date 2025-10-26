import { categories } from "./data.ts";
import { saveAsCsv } from "../utils/file.ts";
import { initializeMunition } from "./generate.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";

export const writeMunitionTables = (unitTable: MeasurementUnitRow[]) => {
  const munitionTables = initializeMunition(categories, unitTable);
  saveAsCsv(munitionTables.categories, {
    producesFile: true,
    filename: "munition_categories.csv",
    quotedColumns: ["name", "description"],
  });
  saveAsCsv(munitionTables.attributes, {
    producesFile: true,
    filename: "munition_category_attributes.csv",
    quotedColumns: ["attributeName", "description", "enum_values"],
  });
  saveAsCsv(munitionTables.types, {
    producesFile: true,
    filename: "munition_types.csv",
    quotedColumns: ["name"],
  });
  saveAsCsv(munitionTables.values, {
    producesFile: true,
    filename: "munition_attribute_values.csv",
    quotedColumns: ["value_text"],
  });
};
