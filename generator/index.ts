import { writeMunitionTables } from "./src/munition/index.ts";
import { writeRankTables } from "./src/ranks/index.ts";
import { writeServicemen } from "./src/servicemen/index.ts";
import { writeUnitTable } from "./src/measurement_units/index.ts";
import { writeMilitarySpecialties } from "./src/military_specialties/index.ts";

const unitTable = writeUnitTable();

writeMunitionTables(unitTable);

writeRankTables(unitTable);

await writeMilitarySpecialties();
writeServicemen();
