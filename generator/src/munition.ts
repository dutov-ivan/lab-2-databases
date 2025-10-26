import { type MunitionCategory } from "./data/munition";
import { type AttributeType } from "./data/AttributeType";
import type { MeasurementUnitTable } from "./units";
import { faker } from "./faker";

type MunitionCategoryTable = {
  id: number;
  name: string;
  is_transport: boolean;
  description?: string;
};

type MunitionAttributeTable = {
  id: number;

  attributeName: string;
  attributeType: AttributeType;
  is_mandatory: boolean;
  is_enum?: boolean;
  enum_values?: string;
  description?: string;
  munition_category_id: number;
  measurement_unit_id?: number;
};

type MunitionTypeTable = {
  id: number;
  name: string;
  munition_category_id: number;
};

type MunitionAttributeValueTable = {
  attribute_id: number;
  munition_type_id: number;
  value_text: string | null;
  value_numeric: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
  value_jsonb: string | null;
};

type MunitionTables = {
  categories: MunitionCategoryTable[];
  attributes: MunitionAttributeTable[];
  types: MunitionTypeTable[];
  values: MunitionAttributeValueTable[];
};

export const initializeMunition = (
  categories: MunitionCategory[],
  physicalUnits: MeasurementUnitTable[]
): MunitionTables => {
  const munitionCategories: MunitionCategoryTable[] = [];
  const munitionAttributes: MunitionAttributeTable[] = [];
  const munitionTypes: MunitionTypeTable[] = [];
  const munitionTypeValues: MunitionAttributeValueTable[] = [];

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
        description: attr.description,
        is_enum: attr.is_enum,
        enum_values: JSON.stringify(attr.enum_values),
        measurement_unit_id: physicalUnitId,
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
        let result: MunitionAttributeValueTable = {
          attribute_id: attr.id,
          munition_type_id: munitionType.id,
          value_text: null,
          value_numeric: null,
          value_boolean: null,
          value_date: null,
          value_jsonb: null,
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
        } else if (attr.attributeType === "JSONB") {
          result.value_jsonb = JSON.stringify({
            info: faker.lorem.sentence(),
          });
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
