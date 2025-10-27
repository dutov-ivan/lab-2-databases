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
    await page.goto("https://zakon.rada.gov.ua/laws/show/z0927-20#Text", {
      waitUntil: "networkidle", // wait for JS rendering
    });
    // ensure the table is present
    await page.waitForSelector(".rvps14 table");

    const content = await page.content();
    await browser.close();

    const $ = load(content);
    const tables = $(".rvps14 table");
    const specialtyTable = tables.filter((_, el) =>
      $(el).text().includes("Найменування військово-облікової спеціальності")
    );
    console.log(`Found ${specialtyTable.length} specialty tables`);

    const parentStack: (ScrapedCategory | undefined)[] = [];
    const categories: ScrapedCategory[] = [];
    const specialties: ScrapedSpecialty[] = [];

    // Use IDs starting at 1 (less ambiguous than 0)
    let categoryIdCounter = 1;
    let currentCategoryId: number | null = null;

    specialtyTable.find("tr").each((i, row) => {
      if (i < 2) return; // skip headers if needed

      const cells = $(row).find("td");

      if (cells.length === 1) {
        const text = cells.first().text().trim();
        const index = text.indexOf(" ");
        if (index === -1) {
          console.warn("Skipping category row with unexpected format:", text);
          return;
        }

        const numbering = text.substring(0, index).trim();
        const name = text.substring(index).trim();

        const level = numbering.split(".").filter(Boolean).length;
        // convert to 0-based index
        const levelIndex = level - 1;

        // parent sits at levelIndex - 1 (or undefined for top-level)
        const parent = levelIndex > 0 ? parentStack[levelIndex - 1] : undefined;

        const newId = categoryIdCounter++;
        const newCategory: ScrapedCategory = {
          id: newId,
          code: numbering,
          name,
        };
        if (parent) newCategory.parentCategory = parent;

        categories.push(newCategory);
        currentCategoryId = newId;

        // set stack at 0-based levelIndex and trim deeper levels
        parentStack[levelIndex] = newCategory;
        parentStack.length = levelIndex + 1;

        console.log(
          `Category: id=${newId} code=${numbering} level=${level} parent=${
            parent?.id ?? null
          }`
        );
      } else if (cells.length === 2) {
        const code = cells.first().text().trim();
        const name = cells.last().text().trim();

        if (!name || name[0] === "{") return;

        if (currentCategoryId === null) {
          console.warn(`Found specialty before any category: ${code} ${name}`);
          return;
        }

        specialties.push({
          code,
          name,
          parentCategoryId: currentCategoryId,
        });

        console.log(
          `Specialty: code=${code} -> parentCategoryId=${currentCategoryId}`
        );
      } else {
        // ignore other rows
        return;
      }
    });

    return { categories, specialties };
  };
