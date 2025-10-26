import { saveAsCsv } from "../utils/file";
import { generateServicemen } from "./generate";

export const writeServicemen = () => {
  const servicemen = generateServicemen(1000);
  saveAsCsv(servicemen, {
    quotedColumns: ["firstName", "lastName", "middleName"],
    producesFile: true,
    filename: "servicemen.csv",
  });
};
