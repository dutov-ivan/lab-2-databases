import { fakerUK as faker } from "@faker-js/faker";
import { mkdir } from "node:fs/promises";

type Serviceman = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string; // 'male' | 'female' etc. — keep string for compatibility with faker
  birthDate: Date; // YYYY-MM-DD
};

const importPath = (file: string) => {
  return `import/${file}`;
};

const createImportDirIfNotExists = async () => {
  const importDir = Bun.file(importPath(""));
  if (!importDir.exists()) {
    await mkdir(importPath(""));
  }
};

const saveAsCsv = async <T extends Record<string, any>>(
  data: T[],
  columns?: (keyof T)[],
  filename?: string
) => {
  await createImportDirIfNotExists();
  const filePath = filename ? importPath(filename) : undefined;
  if (!data || data.length === 0) {
    if (filePath) Bun.write(filePath, "");
    return;
  }

  // derive columns from the first item if not provided
  const cols = (columns ?? (Object.keys(data[0]!) as (keyof T)[])).map(String);

  const escape = (value: any) =>
    value == null ? "" : `"${String(value).replace(/"/g, '""')}"`;

  const csvContent = [
    cols.join(","),
    ...data.map((row) =>
      cols.map((col) => escape((row as any)[col])).join(",")
    ),
  ].join("\n");

  if (filePath) Bun.write(filePath, csvContent);
  else return csvContent;
};

const initializeServicemen = (count: number): Serviceman[] => {
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

const servicemen = initializeServicemen(1000);
saveAsCsv(servicemen, undefined, "servicemen.csv");
