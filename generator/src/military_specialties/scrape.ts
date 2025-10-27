import { chromium } from "playwright";
import { load } from "cheerio";

interface ScrapedCategory {
  id: number;
  code: string;
  name: string;
  parentCategory?: ScrapedCategory; // Links to the parent object
}

interface ScrapedSpecialty {
  code: string;
  name: string;
  parentCategoryId: number; // Refers to ScrapedCategory['id']
}

export interface ScrapedData {
  categories: ScrapedCategory[];
  specialties: ScrapedSpecialty[];
}

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

    // This stack holds the *parent category object* for each level.
    const parentStack: ScrapedCategory[] = [];

    // The flat list of all categories as required by ScrapedData
    const categories: ScrapedCategory[] = [];

    // The flat list of all specialties
    const specialties: ScrapedSpecialty[] = [];

    // --- Changes Start Here ---

    // Counter to generate unique, stable IDs for categories
    let categoryIdCounter = 0;

    // Tracks the ID of the most recently added category.
    let currentCategoryId: number | null = null;

    // --- Changes End Here ---

    specialtyTable.find("tr").each((i, row) => {
      if (i < 2) return; // Skip header rows

      const cells = $(row).find("td");

      if (cells.length === 1) {
        // This is a Category row
        const text = cells.first().text().trim();
        const index = text.indexOf(" ");
        if (index === -1) return; // Skip if format is unexpected

        const numbering = text.substring(0, index).trim();
        const name = text.substring(index).trim();

        const level = numbering.split(".").filter(Boolean).length;
        const parent = parentStack[level - 1];

        // --- Changes Start Here ---

        // 1. Create a new stable ID
        const newId = categoryIdCounter++;

        // 2. Create the new category with its ID
        const newCategory: ScrapedCategory = {
          id: newId,
          code: numbering,
          name,
        };
        if (parent) {
          newCategory.parentCategory = parent;
        }

        // Add to the flat list
        categories.push(newCategory);

        // 3. Update the current ID to this new ID
        currentCategoryId = newId;

        // --- Changes End Here ---

        // Place this new category on the stack at its level
        parentStack[level] = newCategory;
        parentStack.length = level + 1;
      } else if (cells.length === 2) {
        // This is a Specialty row
        const code = cells.first().text().trim();
        const name = cells.last().text().trim();

        if (!name || name[0] === "{") {
          // Skipping the invalid row 997
          return;
        }

        // 4. Check against the currentCategoryId
        if (currentCategoryId === null) {
          console.warn(`Found specialty before any category: ${code} ${name}`);
          return;
        }

        // 5. Link the specialty to the stable ID
        specialties.push({
          code,
          name,
          parentCategoryId: currentCategoryId,
        });

        // --- Changes End Here ---
      } else if (cells.length > 2) {
        return;
      }
    });

    return {
      categories,
      specialties,
    };
  };
