import { loadSpecialtiesFromGovernmentSite } from "./scrape.ts";

export const writeMilitarySpecialties = async () => {
  await loadSpecialtiesFromGovernmentSite();
};
