import { faker } from "./faker";

export type Serviceman = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string; // 'male' | 'female' etc. — keep string for compatibility with faker
  birthDate: Date; // YYYY-MM-DD
};

export const initializeServicemen = (count: number): Serviceman[] => {
  const servicemen: Serviceman[] = [];
  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType();

    servicemen.push({
      id: i + 1,
      firstName: faker.person.firstName(gender),
      lastName: faker.person.lastName(gender),
      middleName: faker.person.middleName(gender),
      gender: gender,
      birthDate: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
    });
  }

  return servicemen;
};
