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
import {
  getServicemenData,
  writeServicemen,
  writeServicemenSpecialties,
} from "./src/servicemen/index.ts";
import { writeUnitLevels, writeUnits } from "./src/units/index.ts";
import { UNIT_LEVELS } from "./src/units/data.ts";
import { writeLocations } from "./src/locations/index.ts";
import { assignRankAndMembersToUnits } from "./src/unit_members/generate.ts";
import { writeUnitMembers } from "./src/unit_members/index.ts";

const measurementUnits = writeUnitTable();

const munitionTables = writeMunitionTables(measurementUnits);

const rankTables = writeRankTables(measurementUnits);

const militarySpecialtyTables = await writeMilitarySpecialties(false);

const servicemenData = getServicemenData();

const locations = writeLocations();
const unitLevels = writeUnitLevels(UNIT_LEVELS);
const units = writeUnits(unitLevels, locations);

const { servicemenWithRanks, unitMembers } = assignRankAndMembersToUnits(
  units,
  unitLevels,
  servicemenData,
  rankTables.ranks,
  rankTables.rankCategories
);

writeServicemen(servicemenWithRanks);

writeUnitMembers(unitMembers);

writeRankAttributeValues(rankTables, servicemenWithRanks);

writeMunitionSupplies(units, munitionTables);

writeServicemenSpecialties(militarySpecialtyTables, servicemenWithRanks);
