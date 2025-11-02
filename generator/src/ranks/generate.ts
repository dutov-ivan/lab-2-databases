import { type Attribute, type AttributeEnum } from "../common/AttributeType.ts";
import type {
  GeneratedRank,
  GeneratedRankAttribute,
  GeneratedRankCategory,
} from "./data.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";

type RankCategoryRow = {
  id: number;
  name: string;
  description: string;
  minRank: number;
  maxRank: number;
};

export interface RankAttributeRow extends Attribute {
  id: number;
  name: string; // Назва атрибута (наприклад, "дата закінчення академії", "дата присвоєння генеральського звання" тощо)
  attributeType: AttributeEnum; // Тип даних атрибута;
  is_enum: boolean; // Чи є цей атрибут таким, що має обмежений набір значень (ENUM)
  is_required: boolean; // Чи є цей атрибут обов'язковим для заповнення
  measurement_unit_id: number | null;
  description: string | null;
  enum_values: string | null;
}

export type RankAttributeToRankRow = {
  rank_id: number; // Ідентифікатор рангу
  attribute_id: number; // Ідентифікатор атрибута
};

export type RankRow = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  rankValue: number;
};

export type RankAttributeValueRow = {
  rank_id: number;
  attribute_id: number;
  serviceman_id: number;
  value_int: number | null;
  value_text: string | null;
  value_float: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
};

export type RankTables = {
  rankCategories: RankCategoryRow[];
  ranks: RankRow[];
  rankAttributes: RankAttributeRow[];
  rankAttributeRanks: RankAttributeToRankRow[];
};

export const generateRankTables = (
  categories: GeneratedRankCategory[],
  attributes: GeneratedRankAttribute[],
  ranks: GeneratedRank[],
  units: MeasurementUnitRow[]
): RankTables => {
  const rankCategories: RankCategoryRow[] = [];
  const rankAttributes: RankAttributeRow[] = [];
  const rankTables: RankRow[] = [];
  const rankAttributeToRank: RankAttributeToRankRow[] = [];

  let categoryId = 1;
  let attributeId = 1;
  let rankId = 1;

  for (const category of categories) {
    rankCategories.push({
      id: categoryId,
      name: category.name,
      description: category.description,
      minRank: category.minRank,
      maxRank: category.maxRank,
    });
    categoryId++;
  }

  for (const rank of ranks) {
    rankTables.push({
      id: rankId,
      name: rank.name,
      description: rank.description,
      categoryId: rankCategories.find(
        (cat) => rank.rankValue >= cat.minRank && rank.rankValue <= cat.maxRank
      )!.id,
      rankValue: rank.rankValue,
    });
    rankId++;
  }

  for (const attr of attributes) {
    rankAttributes.push({
      id: attributeId,
      name: attr.name,
      attributeType: attr.type,
      is_enum: attr.is_enum,
      is_required: attr.is_required,
      measurement_unit_id:
        units.find((unit) => unit.abbreviation === attr.unit)?.id || null,
      description: attr.description || null,
      enum_values: JSON.stringify(attr.enum_values) || null,
    });

    const assignedRanks = attr.assignedToRanks?.map((rankName) =>
      findOrThrow(rankTables, (rank) => rank.name === rankName)
    ) || [...rankTables];

    for (const rank of assignedRanks) {
      rankAttributeToRank.push({
        rank_id: rank.id,
        attribute_id: attributeId,
      });
    }

    attributeId++;
  }

  return {
    rankCategories: rankCategories,
    rankAttributes: rankAttributes,
    ranks: rankTables,
    rankAttributeRanks: rankAttributeToRank,
  };
};
