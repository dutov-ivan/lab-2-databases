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

export type SaveOptions<T> = {
  quotedColumns?: (keyof T)[];
  filename?: string;
  producesFile: boolean;
};

export const saveAsCsv = async <T extends Record<string, any>>(
  data: T[],
  options: SaveOptions<T>
) => {
  await createImportDirIfNotExists();
  const filePath = options.filename ? importPath(options.filename) : undefined;
  if (!data || data.length === 0) {
    if (filePath) Bun.write(filePath, "");
    return;
  }

  // derive columns from the first item if not provided
  const cols = (Object.keys(data[0]!) as (keyof T)[]).map(String);

  const csvContent = [
    cols.join(","),
    ...data.map((row) =>
      cols
        .map((col) => {
          const value = (row as any)[col];
          if (
            !options.quotedColumns ||
            !options.quotedColumns.includes(col as keyof T)
          ) {
            // leave unquoted for numbers, booleans, etc.
            return value == null ? "" : String(value);
          }

          // quote only selected columns
          return value == null ? "" : `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  if (filePath) {
    console.log(`Saving CSV to ${filePath}`);
    Bun.write(filePath, csvContent);
  } else {
    return csvContent;
  }
};
