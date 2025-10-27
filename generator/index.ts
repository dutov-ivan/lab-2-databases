import { writeMunitionTables } from "./src/munition/index.ts";
import {
  writeRankAttributeValues,
  writeRankTables,
} from "./src/ranks/index.ts";
import { writeUnitTable } from "./src/measurement_units/index.ts";
import { writeMilitarySpecialties } from "./src/military_specialties/index.ts";
import { writeServicemenAndUnits } from "./src/servicemen_units/index.ts";

const unitTable = writeUnitTable();

writeMunitionTables(unitTable);

const rankTables = writeRankTables(unitTable);

await writeMilitarySpecialties(true);

const { servicemen } = writeServicemenAndUnits(
  rankTables.ranks.map((rank) => rank.id)
);

writeRankAttributeValues(rankTables, servicemen);
