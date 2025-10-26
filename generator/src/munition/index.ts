import { categories } from "./data";
import { saveAsCsv } from "../utils/file";
import { initializeMunition } from "./generate";
import { UNITS } from "../units/data";
import type { MeasurementUnitRow } from "../units/generate";

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
