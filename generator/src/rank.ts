import type { AttributeType } from "./data/AttributeType";
import type { GeneratedRankCategory } from "./data/rank";
import type { units } from "./data/units";
import type { MeasurementUnitTable } from "./units";

type RankCategoryTable = {
  id: number;
  name: string;
  description: string;
  minRank: number;
  maxRank: number;
};

type RankAttributeTable = {
  name: string; // Назва атрибута (наприклад, "дата закінчення академії", "дата присвоєння генеральського звання" тощо)
  type: AttributeType; // Тип даних атрибута;
  is_enum: boolean; // Чи є цей атрибут таким, що має обмежений набір значень (ENUM)
  is_required: boolean; // Чи є цей атрибут обов'язковим для заповнення
  unit?: (typeof units)[number]["abbreviation"]; // Одиниця виміру, якщо застосовно (має бути одним із значень масиву units, наприклад, "рік", "місяць" тощо)
  description?: string; // Опис атрибута для кращого розуміння його призначення
  enum_values?: string[]; // Якщо тип ENUM, то можливі значення
};

type RankAttributeToRankTable = {
  rank_id: number; // Ідентифікатор рангу
  attribute_id: number; // Ідентифікатор атрибута
};

type RankTable = {
  id: number;
  name: string;
  description: string;
  rankValue: number;
};

type RankAttributeValueTable = {
  id: number;
};

type RankTables = {
  categories: RankCategoryTable[];
  attributes: RankAttributeTable[];
  ranks: RankTable[];
  rankAttributes: RankAttributeToRankTable[];
};

export const initializeRanks = (
  categories: GeneratedRankCategory[],
  physicalUnits: MeasurementUnitTable[]
): RankTables => {
  const rankCategories: RankCategoryTable[] = [];
  const rankAttributes: RankAttributeTable[] = [];
  const ranks: RankTable[] = [];
  const rankAttributeValues: RankAttributeValueTable[] = [];

  let categoryId = 1;
  let typeId = 1;
  let attributeId = 1;

  let attributeValueId = 1;

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
          id: attributeValueId,
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
        attributeValueId++;
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
