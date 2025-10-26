import { writeMunitionTables } from "./src/munition";
import { writeServicemen } from "./src/servicemen";
import { writeUnitTable } from "./src/units";

const unitTable = writeUnitTable();

writeMunitionTables(unitTable);

writeServicemen();
