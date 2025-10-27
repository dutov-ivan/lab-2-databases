import { writeMunitionTables } from "./src/munition/index.ts";
import { writeRankTables } from "./src/ranks/index.ts";
import { writeUnitTable } from "./src/measurement_units/index.ts";
import { writeMilitarySpecialties } from "./src/military_specialties/index.ts";
import { writeServicemenAndUnits } from "./src/servicemen_units/index.ts";

const unitTable = writeUnitTable();

writeMunitionTables(unitTable);

const ranksIds = writeRankTables(unitTable);

await writeMilitarySpecialties(false);

writeServicemenAndUnits(ranksIds);
