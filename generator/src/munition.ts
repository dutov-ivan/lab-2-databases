import {
  type MunitionCategory,
  type AttributeType,
  type AllowedUnits,
} from "./data/munition";

type MunitionCategoryTable = {
  id: number;
  name: string;
  is_transport: boolean;
};

type MunitionAttributeTable = {
  id: number;

  attributeName: string;
  attributeType: AttributeType;
  is_mandatory: boolean;
  unit?: AllowedUnits;
  is_enum?: boolean;
  enum_values?: string;
  description?: string;
  munition_category_id: number;
};

type MunitionTypeTable = {
  id: number;
  name: string;
  munition_category_id: number;
};

type MunitionTables = {
  categories: MunitionCategoryTable[];
  attributes: MunitionAttributeTable[];
  types: MunitionTypeTable[];
};

export const initializeMunition = (
  categories: MunitionCategory[]
): MunitionTables => {
  const munitionCategories: MunitionCategoryTable[] = [];
  const munitionAttributes: MunitionAttributeTable[] = [];
  const munitionTypes: MunitionTypeTable[] = [];

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
      munitionAttributes.push({
        id: attributeId,
        attributeName: attr.name,
        attributeType: attr.type,
        is_mandatory: attr.is_required,
        munition_category_id: categoryId,
        description: attr.description,
        is_enum: attr.is_enum,
        enum_values: JSON.stringify(attr.enum_values),
        unit: attr.unit,
      });
      attributeId++;
    }
    categoryId++;
  }
  return {
    categories: munitionCategories,
    attributes: munitionAttributes,
    types: munitionTypes,
  };
};
