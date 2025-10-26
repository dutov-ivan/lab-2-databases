import { load } from "cheerio";
import { chromium } from "playwright";

export type ScrapedSpecialty = {
  code: string;
  name: string;
  parentCategory?: ScrapedSpecialty;
};

export const loadSpecialtiesFromGovernmentSite = async (): Promise<void> => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://zakon.rada.gov.ua/laws/show/z0927-20#Text");
  const content = await page.content();
  const $ = load(content);
  await browser.close();
  const specialtyTable = $(".rvps14 table");
  console.log("Table loaded, here is the data:", specialtyTable.text());
};
