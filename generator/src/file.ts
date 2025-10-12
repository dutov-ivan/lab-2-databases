import { mkdir } from "node:fs/promises";

const importPath = (file: string) => {
  return `import/${file}`;
};

const createImportDirIfNotExists = async () => {
  const importDir = Bun.file(importPath(""));
  if (!importDir.exists()) {
    await mkdir(importPath(""));
  }
};

export const saveAsCsv = async <T extends Record<string, any>>(
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
