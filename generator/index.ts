import { categories } from "./src/data/munition";
import { units } from "./src/data/units";
import { saveAsCsv } from "./src/file";
import { initializeMunition } from "./src/munition";
import { initializeServicemen } from "./src/servicemen";
import { initializeUnits } from "./src/units";

const servicemen = initializeServicemen(1000);
saveAsCsv(servicemen, {
  quotedColumns: ["firstName", "lastName", "middleName"],
  producesFile: true,
  filename: "servicemen.csv",
});

const physicalUnits = initializeUnits(units);
saveAsCsv(physicalUnits, {
  producesFile: true,
  filename: "measurement_units.csv",
  quotedColumns: ["name", "abbreviation"],
});

const munitionTables = initializeMunition(categories, physicalUnits);
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
  quotedColumns: ["value_text", "value_jsonb"],
});
