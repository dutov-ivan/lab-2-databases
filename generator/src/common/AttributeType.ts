import { faker } from "../utils/faker.ts";

export type AttributeEnum = "INT" | "STRING" | "BOOL" | "DATE" | "FLOAT";

export interface Attribute {
  is_enum: boolean;
  attributeType: AttributeEnum;
  enum_values: string | null;
}

export interface AttributeValue {
  value_int: number | null;
  value_text: string | null;
  value_float: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
}

export const randomAttributeValue = (
  attr: Attribute,
  result: AttributeValue
) => {
  if (attr.is_enum && attr.enum_values) {
    const enumVals: string[] = JSON.parse(attr.enum_values);
    const randomEnumValue =
      enumVals[Math.floor(Math.random() * enumVals.length)];
    result.value_text = randomEnumValue!;
  } else if (attr.attributeType === "INT") {
    result.value_int = faker.number.int({ min: 0, max: 10000 });
  } else if (attr.attributeType === "FLOAT") {
    result.value_float = faker.number.float({
      min: 0,
      max: 1000,
      fractionDigits: 2,
    });
  } else if (attr.attributeType === "STRING") {
    result.value_text = faker.word.words(3);
  } else if (attr.attributeType === "BOOL") {
    result.value_boolean = faker.datatype.boolean();
  } else if (attr.attributeType === "DATE") {
    result.value_date = faker.date.past().toISOString().split("T")[0]!;
  }
};
