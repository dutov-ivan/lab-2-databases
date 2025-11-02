import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import type { ServicemanRow } from "../servicemen/generate.ts";
import { saveAsCsv } from "../utils/file.ts";
import { RANK_ATTRIBUTES, RANK_CATEGORIES, RANKS } from "./data.ts";
import { generateRankTables, type RankTables } from "./generate.ts";
import { generateRankAttributeValues } from "../servicemen/generate.ts";

export const writeRankTables = (
  unitTable: MeasurementUnitRow[]
): RankTables => {
  const rankTables = generateRankTables(
    RANK_CATEGORIES,
    RANK_ATTRIBUTES,
    RANKS,
    unitTable
  );

  const { rankCategories, ranks, rankAttributes, rankAttributeRanks } =
    rankTables;
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
  return rankTables;
};

export const writeRankAttributeValues = (
  ranksTables: RankTables,
  servicemen: ServicemanRow[]
): void => {
  const { ranks, rankAttributes, rankAttributeRanks } = ranksTables;
  const rankAttributeValues = generateRankAttributeValues(
    ranks,
    rankAttributeRanks,
    rankAttributes,
    servicemen
  );
  saveAsCsv(rankAttributeValues, {
    producesFile: true,
    filename: "rank_attribute_values.csv",
    quotedColumns: ["value_text"],
  });
};
