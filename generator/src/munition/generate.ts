import { type MunitionCategory } from "./data.ts";
import { type AttributeEnum } from "../common/AttributeType.ts";
import type { MeasurementUnitRow } from "../measurement_units/generate.ts";
import { faker } from "../utils/faker.ts";
import type { Unit } from "../units/generate.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";

type MunitionCategoryRow = {
  id: number;
  name: string;
  is_transport: boolean;
  description?: string;
};

type MunitionAttributeRow = {
  id: number;

  attributeName: string;
  attributeType: AttributeEnum;
  is_mandatory: boolean;
  is_enum: boolean | null;
  enum_values: string | null;
  description: string | null;
  munition_category_id: number;
  measurement_unit_id: number | null;
};

type MunitionTypeRow = {
  id: number;
  name: string;
  munition_category_id: number;
};

type MunitionAttributeValueRow = {
  attribute_id: number;
  munition_type_id: number;
  value_text: string | null;
  value_numeric: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
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

export const initializeMunition = (
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
          value_text: null,
          value_numeric: null,
          value_boolean: null,
          value_date: null,
        };

        if (attr.is_enum && attr.enum_values) {
          const enumVals: string[] = JSON.parse(attr.enum_values);
          const randomEnumValue =
            enumVals[Math.floor(Math.random() * enumVals.length)];
          result.value_text = randomEnumValue!;
        } else if (attr.attributeType === "INT") {
          result.value_numeric = faker.number.int({ min: 0, max: 10000 });
        } else if (attr.attributeType === "FLOAT") {
          result.value_numeric = faker.number.float({
            min: 0,
            max: 10000,
            fractionDigits: 2,
          });
        } else if (attr.attributeType === "STRING") {
          result.value_text = faker.lorem.words(3);
        } else if (attr.attributeType === "BOOL") {
          result.value_boolean = faker.datatype.boolean();
        } else if (attr.attributeType === "DATE") {
          result.value_date = faker.date.past().toISOString().split("T")[0]!;
        }
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

export const generateMunitionSupplies = (
  units: Unit[],
  munitionTypes: MunitionTypeRow[],
  munitionCategory: MunitionCategoryRow[],
  mostTypesPerUnit: number
): MunitionSupplyRow[] => {
  const maxLevel = Math.max(...units.map((u) => u.level_id));
  const leastUnit = units.filter((u) => u.level_id === maxLevel);

  const munitionSupplies: MunitionSupplyRow[] = [];
  for (const unit of leastUnit) {
    const typesCount = faker.number.int({ min: 1, max: mostTypesPerUnit });
    const selectedTypes = faker.helpers.arrayElements(
      munitionTypes,
      typesCount
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
    }
  }
  return munitionSupplies;
};
