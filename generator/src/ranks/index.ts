import type { MeasurementUnitRow } from "../measurement_units/generate";
import { saveAsCsv } from "../utils/file";
import { RANK_ATTRIBUTES, RANK_CATEGORIES, RANKS } from "./data";
import { generateRankTables } from "./generate";

export const writeRankTables = (unitTable: MeasurementUnitRow[]) => {
  const { ranks, rankAttributes, rankAttributeRanks, rankCategories } =
    generateRankTables(RANK_CATEGORIES, RANK_ATTRIBUTES, RANKS, unitTable);

  saveAsCsv(rankCategories, {
    producesFile: true,
    filename: "rank_categories.csv",
    quotedColumns: ["name", "description"],
  });

  saveAsCsv(ranks, {
    producesFile: true,
    filename: "ranks.csv",
    quotedColumns: ["name", "description"],
  });

  saveAsCsv(rankAttributes, {
    producesFile: true,
    filename: "rank_attributes.csv",
    quotedColumns: ["name", "description", "enum_values"],
  });

  saveAsCsv(rankAttributeRanks, {
    producesFile: true,
    filename: "ranks_rank_attributes.csv",
  });
};
