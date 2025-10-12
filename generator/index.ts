import { categories } from "./src/data/munition";
import { saveAsCsv } from "./src/file";
import { initializeMunition } from "./src/munition";
import { initializeServicemen } from "./src/servicemen";

const servicemen = initializeServicemen(1000);
saveAsCsv(servicemen, undefined, "servicemen.csv");

const munitionTables = initializeMunition(categories);
saveAsCsv(munitionTables.categories, undefined, "munition_categories.csv");
saveAsCsv(munitionTables.attributes, undefined, "munition_attributes.csv");
saveAsCsv(munitionTables.types, undefined, "munition_types.csv");
