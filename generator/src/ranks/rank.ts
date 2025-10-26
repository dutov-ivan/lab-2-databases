import type { AttributeType } from "../common/AttributeType";
import type {
  GeneratedRank,
  GeneratedRankAttribute,
  GeneratedRankCategory,
} from "../data/rank";
import type { MeasurementUnitRow } from "../units/generate";
import { findOrThrow } from "../utils/findOrThrow";

type RankCategoryRow = {
  id: number;
  name: string;
  description: string;
  minRank: number;
  maxRank: number;
};

type RankAttributeRow = {
  name: string; // Назва атрибута (наприклад, "дата закінчення академії", "дата присвоєння генеральського звання" тощо)
  type: AttributeType; // Тип даних атрибута;
  is_enum: boolean; // Чи є цей атрибут таким, що має обмежений набір значень (ENUM)
  is_required: boolean; // Чи є цей атрибут обов'язковим для заповнення
  measurement_unit_id?: number;
  description?: string;
  enum_values?: string;
};

type RankAttributeToRankRow = {
  rank_id: number; // Ідентифікатор рангу
  attribute_id: number; // Ідентифікатор атрибута
};

type RankRow = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  rankValue: number;
};

type RankAttributeValueRow = {
  rank_id: number;
  attribute_id: number;
  serviceman_id: number;
  value_text: string | null;
  value_numeric: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
  value_jsonb: string | null;
};

type RankTables = {
  categories: RankCategoryRow[];
  attributes: RankAttributeRow[];
  ranks: RankRow[];
  rankAttributes: RankAttributeToRankRow[];
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
      name: attr.name,
      type: attr.type,
      is_enum: attr.is_enum,
      is_required: attr.is_required,
      measurement_unit_id: units.find((unit) => unit.abbreviation === attr.unit)
        ?.id,
      description: attr.description,
      enum_values: JSON.stringify(attr.enum_values),
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
    categories: rankCategories,
    attributes: rankAttributes,
    ranks: rankTables,
    rankAttributes: rankAttributeToRank,
  };
};
