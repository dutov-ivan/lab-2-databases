import { saveAsCsv } from "../utils/file";
import { generateLocations } from "./generate";

const writeLocations = () => {
  const locations = generateLocations(100);
  saveAsCsv(locations, {
    quotedColumns: ["name"],
    producesFile: true,
    filename: "locations.csv",
  });
};
