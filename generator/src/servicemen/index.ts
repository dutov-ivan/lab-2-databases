import { saveAsCsv } from "../utils/file.ts";
import { generateServicemen } from "./generate.ts";

export const writeServicemen = () => {
  const servicemen = generateServicemen(1000);
  saveAsCsv(servicemen, {
    quotedColumns: ["firstName", "lastName", "middleName"],
    producesFile: true,
    filename: "servicemen.csv",
  });
};
