import { saveAsCsv } from "../utils/file.ts";
import { generateLocations } from "./generate.ts";

export const writeLocations = () => {
  const locations = generateLocations(100);
  saveAsCsv(locations, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "locations.csv",
  });
  return locations;
};
