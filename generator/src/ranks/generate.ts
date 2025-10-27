import {
  randomAttributeValue as setRandomAttributeValue,
  type Attribute,
  type AttributeEnum,
} from "../common/AttributeType.ts";
import type {
  GeneratedRank,
  GeneratedRankAttribute,
  GeneratedRankCategory,
} from "./data.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";
import type { ServicemanWithUnit } from "../servicemen/generate.ts";
import { faker } from "../utils/faker.ts";

type RankCategoryRow = {
  id: number;
  name: string;
  description: string;
  minRank: number;
  maxRank: number;
};

interface RankAttributeRow extends Attribute {
  id: number;
  name: string; // Назва атрибута (наприклад, "дата закінчення академії", "дата присвоєння генеральського звання" тощо)
  attributeType: AttributeEnum; // Тип даних атрибута;
  is_enum: boolean; // Чи є цей атрибут таким, що має обмежений набір значень (ENUM)
  is_required: boolean; // Чи є цей атрибут обов'язковим для заповнення
  measurement_unit_id: number | null;
  description: string | null;
  enum_values: string | null;
}

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

export const generateRankAttributeValues = (
  ranks: RankRow[],
  rankAttributeRanks: RankAttributeToRankRow[],
  rankAttributes: RankAttributeRow[],
  servicemen: ServicemanWithUnit[]
): RankAttributeValueRow[] => {
  const allRankAttributesForEachRank: Map<number, RankAttributeRow[]> =
    new Map();

  for (const rank of ranks) {
    const availableRankAttributes = rankAttributeRanks
      .filter((rar) => rar.rank_id === rank.id)
      .map((rar) =>
        findOrThrow(rankAttributes, (attr) => attr.id === rar.attribute_id)
      );
    allRankAttributesForEachRank.set(rank.id, availableRankAttributes);
  }

  const rankAttributeValues: RankAttributeValueRow[] = [];

  for (const serviceman of servicemen) {
    const servicemanRank = findOrThrow(
      ranks,
      (rank) => rank.id === serviceman.rankId
    );

    const chosenRankAttributes = allRankAttributesForEachRank
      .get(servicemanRank.id)
      ?.filter((attr) => {
        return attr.is_required || faker.datatype.boolean();
      })!;

    for (const attr of chosenRankAttributes) {
      let result: RankAttributeValueRow = {
        rank_id: servicemanRank.id,
        attribute_id: attr.id,
        serviceman_id: serviceman.id,
        value_int: null,
        value_text: null,
        value_float: null,
        value_boolean: null,
        value_date: null,
      };

      setRandomAttributeValue(attr, result);

      rankAttributeValues.push(result);
    }
  }
  return rankAttributeValues;
};
