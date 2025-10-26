import { writeMunitionTables } from "./src/munition";
import { writeRankTables } from "./src/ranks";
import { writeServicemen } from "./src/servicemen";
import { writeUnitTable } from "./src/units";

const unitTable = writeUnitTable();

writeMunitionTables(unitTable);

writeRankTables(unitTable);

writeServicemen();
