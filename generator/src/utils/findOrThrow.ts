export const findOrThrow = <T>(
  array: T[],
  predicate: (item: T) => boolean
): T => {
  const result = array.find(predicate);
  if (!result) {
    throw new Error("Item not found");
  }
  return result;
};
