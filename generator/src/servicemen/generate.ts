import { randomAttributeValue as setRandomAttributeValue } from "../common/AttributeType.ts";
import type {
  RankRow,
  RankAttributeToRankRow,
  RankAttributeRow,
  RankAttributeValueRow,
} from "../ranks/generate.ts";
import { toSqlDate } from "../utils/date.ts";
import { faker } from "../utils/faker.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";

export const serviceTypes = [
  "conscription", // строкова служба
  "contract", // контрактна служба
  "mobilized", // служба за призовом під час мобілізації
  "officer_draft", // офіцерська служба за призовом
  "reserve", // служба в резерві
  "volunteer", // доброволець / тероборона
  "other", // інші (для спецслужб, місій тощо)
] as const;

export type ServiceType = (typeof serviceTypes)[number];

export interface ServicemanDataRow {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string; // YYYY-MM-DD
  sex: string; // 'male' | 'female' etc. — keep string for compatibility with faker
  serviceType: ServiceType;
  enlistmentDate: string;
  dischargeDate: string | null;
  phoneNumber: string | null;
  email: string | null;
}

export interface ServicemanRow extends ServicemanDataRow {
  rankId: number;
}

export const generateServicemen = (count: number): ServicemanDataRow[] => {
  const servicemen: ServicemanDataRow[] = [];
  const phones = new Set<string>();
  const emails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType();

    let phoneNumber: string | null = null;
    if (faker.datatype.boolean({ probability: 0.9 })) {
      do {
        phoneNumber = faker.phone.number({ style: "international" });
      } while (phones.has(phoneNumber));
      phones.add(phoneNumber);
    }

    let email: string | null = null;

    if (faker.datatype.boolean({ probability: 0.4 })) {
      do {
        email = faker.internet.email();
      } while (emails.has(email));
      emails.add(email);
    }

    servicemen.push({
      id: i + 1,
      firstName: faker.person.firstName(gender),
      lastName: faker.person.lastName(gender),
      middleName: faker.person.middleName(gender),
      birthDate: toSqlDate(
        faker.date.birthdate({ min: 18, max: 60, mode: "age" })
      ),
      sex: gender == "female" ? "F" : "M",
      serviceType: faker.helpers.arrayElement(serviceTypes),
      enlistmentDate: toSqlDate(faker.date.past({ years: 10 })),
      dischargeDate: faker.datatype.boolean({ probability: 0.7 })
        ? toSqlDate(faker.date.future({ years: 3 }))
        : null,
      phoneNumber,
      email,
    });
  }

  return servicemen;
};

export type SpecialtyServicemenRow = {
  servicemanId: number;
  specialtyId: number;
  attainedAt: string;
  proficiencyLevel: number;
};

export const assignSpecialtiesToServicemen = (
  servicemen: ServicemanDataRow[],
  specialtyIds: number[]
): SpecialtyServicemenRow[] => {
  const specialtyServicemen: SpecialtyServicemenRow[] = [];
  for (const serviceman of servicemen) {
    const specialtiesCount = faker.number.int({ min: 1, max: 3 });
    const selectedSpecialties = faker.helpers.arrayElements(
      specialtyIds,
      specialtiesCount
    );
    for (const specialtyId of selectedSpecialties) {
      specialtyServicemen.push({
        servicemanId: serviceman.id,
        specialtyId,
        attainedAt: toSqlDate(faker.date.past({ years: 5 })),
        proficiencyLevel: faker.number.int({ min: 1, max: 5 }),
      });
    }
  }
  return specialtyServicemen;
};
export const generateRankAttributeValues = (
  ranks: RankRow[],
  rankAttributeRanks: RankAttributeToRankRow[],
  rankAttributes: RankAttributeRow[],
  servicemen: ServicemanRow[]
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
