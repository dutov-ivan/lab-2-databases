import {
  writeMunitionSupplies,
  writeMunitionTables,
} from "./src/munition/index.ts";
import {
  writeRankAttributeValues,
  writeRankTables,
} from "./src/ranks/index.ts";
import { writeUnitTable } from "./src/measurement_units/index.ts";
import { writeMilitarySpecialties } from "./src/military_specialties/index.ts";
import { writeServicemenAndUnits } from "./src/servicemen_units/index.ts";
import { writeServicemenSpecialties } from "./src/servicemen/index.ts";

const measurementUnits = writeUnitTable();

const munitionTables = writeMunitionTables(measurementUnits);

const rankTables = writeRankTables(measurementUnits);

const militarySpecialtyTables = await writeMilitarySpecialties(true);

const { servicemen, units } = writeServicemenAndUnits(
  rankTables.ranks.map((rank) => rank.id)
);

writeRankAttributeValues(rankTables, servicemen);

writeMunitionSupplies(units, munitionTables);

writeServicemenSpecialties(militarySpecialtyTables, servicemen);
