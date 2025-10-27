import { categories } from "./data.ts";
import { saveAsCsv } from "../utils/file.ts";
import {
  generateMunitionSupplies,
  generateMunitionTables,
  type MunitionSupplyRow,
  type MunitionTables,
} from "./generate.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import type { Unit } from "../units/generate.ts";

export const writeMunitionTables = (
  unitTable: MeasurementUnitRow[]
): MunitionTables => {
  const munitionTables = generateMunitionTables(categories, unitTable);
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

  return munitionTables;
};

export const writeMunitionSupplies = (
  units: Unit[],
  munitionTables: MunitionTables
): MunitionSupplyRow[] => {
  const { types: munitionTypes, categories: munitionCategory } = munitionTables;
  const munitionSupplies: MunitionSupplyRow[] = generateMunitionSupplies(
    units,
    munitionTypes,
    munitionCategory,
    20
  );

  saveAsCsv(munitionSupplies, {
    producesFile: true,
    filename: "munition_supplies.csv",
  });

  return munitionSupplies;
};
