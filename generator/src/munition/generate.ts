import { type MunitionCategory } from "./data.ts";
import {
  randomAttributeValue,
  type Attribute,
  type AttributeEnum,
  type AttributeValue,
} from "../common/AttributeType.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import { faker } from "../utils/faker.ts";
import type { UnitRow } from "../units/generate.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";

type MunitionCategoryRow = {
  id: number;
  name: string;
  is_transport: boolean;
  description?: string;
};

type MunitionAttributeRow = Attribute & {
  id: number;
  attributeName: string;
  is_mandatory: boolean;
  description: string | null;
  munition_category_id: number;
  measurement_unit_id: number | null;
};

type MunitionTypeRow = {
  id: number;
  name: string;
  munition_category_id: number;
};

type MunitionAttributeValueRow = AttributeValue & {
  attribute_id: number;
  munition_type_id: number;
};

export type MunitionTables = {
  categories: MunitionCategoryRow[];
  attributes: MunitionAttributeRow[];
  types: MunitionTypeRow[];
  values: MunitionAttributeValueRow[];
};

export type MunitionSupplyRow = {
  quantity: number;
  unit_id: number;
  munition_type_id: number;
};

export const generateMunitionTables = (
  categories: MunitionCategory[],
  physicalUnits: MeasurementUnitRow[]
): MunitionTables => {
  const munitionCategories: MunitionCategoryRow[] = [];
  const munitionAttributes: MunitionAttributeRow[] = [];
  const munitionTypes: MunitionTypeRow[] = [];
  const munitionTypeValues: MunitionAttributeValueRow[] = [];

  let categoryId = 1;
  let typeId = 1;
  let attributeId = 1;

  for (const category of categories) {
    munitionCategories.push({
      id: categoryId,
      name: category.name,
      is_transport: category.is_transport,
    });
    for (const typeName of category.type_names) {
      munitionTypes.push({
        id: typeId,
        name: typeName,
        munition_category_id: categoryId,
      });
      typeId++;
    }
    for (const attr of category.attributes) {
      const physicalUnitId = physicalUnits.find(
        (unit) => unit.abbreviation === attr.unit
      )?.id;
      munitionAttributes.push({
        id: attributeId,
        attributeName: attr.name,
        attributeType: attr.type,
        is_mandatory: attr.is_required,
        munition_category_id: categoryId,
        description: attr.description || null,
        is_enum: attr.is_enum,
        enum_values: JSON.stringify(attr.enum_values),
        measurement_unit_id: physicalUnitId || null,
      });
      attributeId++;
    }
    categoryId++;
  }

  for (const munitionType of munitionTypes) {
    const categoryId = munitionType.munition_category_id;

    munitionAttributes
      .filter((attr) => attr.munition_category_id === categoryId)
      .forEach((attr) => {
        // TODO: Not include non-mandatory attributes sometimes
        let result: MunitionAttributeValueRow = {
          attribute_id: attr.id,
          munition_type_id: munitionType.id,
          value_int: null,
          value_text: null,
          value_float: null,
          value_boolean: null,
          value_date: null,
        };

        if (!attr.is_mandatory && faker.datatype.boolean(0.4)) {
          return;
        }
        randomAttributeValue(attr, result);
        munitionTypeValues.push(result);
      });
  }
  return {
    categories: munitionCategories,
    attributes: munitionAttributes,
    types: munitionTypes,
    values: munitionTypeValues,
  };
};

export type MunitionSupplyPrimaryKey = {
  unit_id: number;
  munition_type_id: number;
};

export const generateMunitionSupplies = (
  units: UnitRow[],
  munitionTypes: MunitionTypeRow[],
  munitionCategory: MunitionCategoryRow[],
  mostTypesPerUnit: number
): MunitionSupplyRow[] => {
  const highestLevel = Math.min(...units.map((u) => u.level_id));
  const leastUnit = units.filter((u) => u.level_id === highestLevel);

  const munitionSupplies: MunitionSupplyRow[] = [];
  // store composite keys as strings "<unit_id>:<munition_type_id>" so Set dedup works
  const prevGenerations: Set<string> = new Set();

  // Required by task in 3rd lab
  populateBMPTypes(
    munitionCategory,
    munitionTypes,
    leastUnit,
    munitionSupplies,
    prevGenerations
  );

  for (const unit of leastUnit) {
    const typesCount = faker.number.int({ min: 1, max: mostTypesPerUnit });
    const selectedTypes = generateTypesUntilAvailable(
      munitionTypes,
      typesCount,
      (type_id: number) => {
        return prevGenerations.has(`${unit.id}:${type_id}`);
      }
    );

    for (const type of selectedTypes) {
      const is_transport = findOrThrow(munitionCategory, (cat) => {
        return cat.id === type.munition_category_id;
      }).is_transport;
      const quantity = faker.number.int(
        is_transport
          ? {
              min: 1,
              max: 20,
            }
          : {
              min: 10,
              max: 1000,
            }
      );

      munitionSupplies.push({
        unit_id: unit.id,
        munition_type_id: type.id,
        quantity,
      });

      // add composite key so we don't generate the same (unit,type) again
      prevGenerations.add(`${unit.id}:${type.id}`);
    }
  }
  return munitionSupplies;
};
function generateTypesUntilAvailable(
  munitionTypes: MunitionTypeRow[],
  typesCount: number,
  alreadyGenerated: (type_id: number) => boolean
): MunitionTypeRow[] {
  // filter out types that are already generated for the specific unit
  const available = munitionTypes.filter((t) => !alreadyGenerated(t.id));

  if (available.length === 0) return [];

  const pickCount = Math.min(typesCount, available.length);
  return faker.helpers.arrayElements(available, pickCount);
}

function populateBMPTypes(
  munitionCategory: MunitionCategoryRow[],
  munitionTypes: MunitionTypeRow[],
  leastUnit: UnitRow[],
  munitionSupplies: MunitionSupplyRow[],
  prevGenerations: Set<string>
) {
  const bmpRegex = /.*БМП.*/;
  const bmpCount = 10;
  const bmpCategory = findOrThrow(munitionCategory, (cat) =>
    bmpRegex.test(cat.name)
  );
  const bmpTypes = munitionTypes.filter(
    (mt) => mt.munition_category_id === bmpCategory.id
  );
  if (bmpTypes.length === 0 || leastUnit.length === 0) return;

  const pairs: { unit: UnitRow; type: MunitionTypeRow }[] = [];
  for (const unit of leastUnit) {
    for (const bt of bmpTypes) {
      const key = `${unit.id}:${bt.id}`;
      if (!prevGenerations.has(key)) {
        pairs.push({ unit, type: bt });
      }
    }
  }

  const shuffled = faker.helpers.shuffle(pairs);
  const take = Math.min(bmpCount, shuffled.length);
  for (const { unit, type } of shuffled.slice(0, take)) {
    munitionSupplies.push({
      unit_id: unit.id,
      munition_type_id: type.id,
      quantity: faker.number.int({ min: 1, max: 20 }),
    });
    prevGenerations.add(`${unit.id}:${type.id}`);
  }
}
