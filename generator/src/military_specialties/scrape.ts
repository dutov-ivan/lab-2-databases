import { load } from "cheerio";
import { chromium } from "playwright";

export type ScrapedCategory = {
  name: string;
  code: string;
  parentCategory?: ScrapedCategory;
};

export type ScrapedSpecialty = {
  name: string;
  code: string;
  parentCategoryId: number;
};

export type ScrapedData = {
  categories: ScrapedCategory[];
  specialties: ScrapedSpecialty[];
};

export const loadSpecialtiesFromGovernmentSite =
  async (): Promise<ScrapedData> => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("https://zakon.rada.gov.ua/laws/show/z0927-20#Text");
    const content = await page.content();
    await browser.close();

    const $ = load(content);
    const tables = $(".rvps14 table");
    const specialtyTable = tables.filter((_, el) =>
      $(el).text().includes("Найменування військово-облікової спеціальності")
    );
    console.log(`Found ${specialtyTable.length} specialty tables`);

    let currentLevel = 0;
    const categories: ScrapedCategory[] = [];
    const specialties: ScrapedSpecialty[] = [];
    specialtyTable.find("tr").each((i, row) => {
      if (i < 2) return; // Skip header rows

      const cells = $(row).find("td");
      if (cells.length == 1) {
        const text = cells.first().text().trim();
        const index = text.indexOf(" ");
        const name = text.substring(index).trim();
        const numbering = text.substring(0, index).trim();
        const level = numbering.split(".").length;
        if (level > currentLevel) {
          // Subcategory
          const parent = categories[categories.length - 1];
          categories.push({ code: numbering, name, parentCategory: parent });
        } else {
          // New category
          categories.push({ code: numbering, name });
        }
        currentLevel = level;
      } else if (cells.length === 2) {
        const code = cells.first().text().trim();
        const name = cells.last().text().trim();
        if (!name || name[0] === "{") {
          // Skipping the invalid row 997
          return;
        }
        specialties.push({
          code,
          name,
          parentCategoryId: categories.length - 1,
        });
      } else {
        throw new Error(
          `Unexpected number of cells in specialty table row: ${
            cells.length
          }, text: ${$(row).text()}`
        );
      }
    });
    return {
      categories,
      specialties,
    };
  };
