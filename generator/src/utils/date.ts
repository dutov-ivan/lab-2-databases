export const toSqlDate = (date: Date) => date.toISOString().split("T")[0]!;
export const toSqlTimestamp = (date: Date) => {
  const iso = date.toISOString(); // "2025-10-27T11:45:30.123Z"
  return iso.replace("T", " ").replace(/\.\d+Z$/, "")!;
};

export const dateYearsAgo = (years: number): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date;
};
