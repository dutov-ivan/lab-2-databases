import { saveAsCsv } from "../utils/file.ts";
import type { UnitMember } from "./generate.ts";

export const writeUnitMembers = (unitMembers: UnitMember[]) => {
  saveAsCsv(unitMembers, {
    producesFile: true,
    filename: "unit_members.csv",
  });
};
