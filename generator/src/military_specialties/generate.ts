import type { ScrapedCategory, ScrapedData } from "./scrape";

type MilitarySpecialtyRow = {
  id: number;
  name: string;
  code: string;
  parent_category_id: number;
};

type MilitarySpecialtyCategoryRow = {
  id: number;
  name: string;
  code: string;
  parent_category_id: number | null;
};

type MilitarySpecialtyTables = {
  specialties: MilitarySpecialtyRow[];
  categories: MilitarySpecialtyCategoryRow[];
};

export const generateSpecialties = (
  scrapedData: ScrapedData
): MilitarySpecialtyTables => {
  const { categories, specialties } = scrapedData;
  const categoryRows: MilitarySpecialtyCategoryRow[] = categories.map(
    (category, index) => ({
      id: index + 1,
      name: category.name,
      code: category.code,
      parent_category_id: category.parentCategory
        ? categories.indexOf(category.parentCategory) + 1
        : null,
    })
  );
  const specialtyRows: MilitarySpecialtyRow[] = specialties.map(
    (specialty, index) => ({
      id: index + 1,
      name: specialty.name,
      code: specialty.code,
      parent_category_id: specialty.parentCategoryId,
    })
  );
  return {
    specialties: specialtyRows,
    categories: categoryRows,
  };
};
