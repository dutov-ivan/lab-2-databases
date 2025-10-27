import { toSqlDate } from "../utils/date.ts";
import { faker } from "../utils/faker.ts";

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

export interface ServicemanWithoutRelations {
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
  rankId: number;
}

export type ServicemanWithUnit = ServicemanWithoutRelations & {
  unitId: number;
};

export const generateServicemenWithoutUnit = (
  count: number,
  rankIds: number[]
): ServicemanWithoutRelations[] => {
  const servicemen: ServicemanWithoutRelations[] = [];
  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType();

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
      phoneNumber: faker.datatype.boolean({ probability: 0.8 })
        ? faker.phone.number({ style: "international" })
        : null,
      email: faker.datatype.boolean({ probability: 0.9 })
        ? faker.internet.email()
        : null,
      rankId: faker.helpers.arrayElement(rankIds),
    });
  }

  return servicemen;
};

export const assignUnitsToServicemen = (
  servicemen: ServicemanWithoutRelations[],
  unitIds: number[]
): ServicemanWithUnit[] => {
  return servicemen.map((serviceman, i) => ({
    ...serviceman,
    unitId: unitIds[i] ?? faker.helpers.arrayElement(unitIds),
  }));
};

export type SpecialtyServicemenRow = {
  servicemanId: number;
  specialtyId: number;
};

export const assignSpecialtiesToServicemen = (
  servicemen: ServicemanWithUnit[],
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
      });
    }
  }
  return specialtyServicemen;
};
