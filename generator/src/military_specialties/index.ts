import { saveAsCsv } from "../utils/file.ts";
import { generateSpecialties } from "./generate.ts";
import {
  loadSpecialtiesFromGovernmentSite,
  type ScrapedData,
} from "./scrape.ts";
import { access, readFile, writeFile } from "fs/promises";

export const writeMilitarySpecialties = async (loadLocally: boolean) => {
  let loadedSpecialties: ScrapedData;
  if (loadLocally) {
    try {
      await access("import/scaped_military_specialties.json");
      // File exists, load locally
      const fileContents = await readFile(
        "import/scaped_military_specialties.json",
        "utf-8"
      );
      loadedSpecialties = JSON.parse(fileContents);
    } catch {
      loadedSpecialties = await loadSpecialtiesFromGovernmentSite();
      writeFile(
        "import/scaped_military_specialties.json",
        JSON.stringify(loadedSpecialties, null, 2),
        "utf-8"
      );
    }
  } else {
    loadedSpecialties = await loadSpecialtiesFromGovernmentSite();
  }

  const { specialties, categories } = generateSpecialties(loadedSpecialties);
  saveAsCsv(specialties, {
    producesFile: true,
    filename: "military_specialties.csv",
    quotedColumns: ["code", "name"],
  });

  saveAsCsv(categories, {
    producesFile: true,
    filename: "military_specialty_categories.csv",
    quotedColumns: ["code", "name"],
  });
};
