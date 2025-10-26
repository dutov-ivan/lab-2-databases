import { faker } from "../utils/faker";
import { findOrThrow } from "../utils/findOrThrow";
import type { UnitLevel } from "./data";
import type { LocationRow } from "./location";

type UnitNode = {
  name: string;
  level_id: number;
  location_id: number;
  children: UnitNode[];
};

const generateUnitNode = (
  locations: LocationRow[],
  levels: UnitLevel[]
): UnitNode => {
  return {
    name: faker.word.noun(),
    level_id: faker.helpers.arrayElement(levels).id,
    location_id: faker.helpers.arrayElement(locations).id,
    children: [],
  };
};

const generateUnitTree = (
  count: number,
  locations: LocationRow[],
  levels: UnitLevel[]
) => {
  let remainingNodes = count;
  const rootNode: UnitNode = generateUnitNode(locations, levels);

  remainingNodes--;

  let levelsWithNodes: UnitNode[][] = [];
  for (let i = 0; i < levels.length; i++) {
    levelsWithNodes.push([]);
  }
  levelsWithNodes[0]!.push(rootNode);
  while (remainingNodes > 0) {
    const currentLevel =
      levelsWithNodes[
        faker.number.int({ min: 1, max: levelsWithNodes.length - 1 }) // Exclude root level
      ]!;
    currentLevel.push(generateUnitNode(locations, levels));
    remainingNodes--;
  }

  for (let level = 1; level < levelsWithNodes.length; level++) {
    const parentLevel = levelsWithNodes[level - 1]!;
    for (const node of levelsWithNodes[level]!) {
      const parentNode = faker.helpers.arrayElement(parentLevel);
      parentNode.children.push(node);
    }
  }

  return rootNode;
};

export const generateUnitsWithoutCaptain = (
  count: number,
  levels: UnitLevel[],
  locations: LocationRow[]
) => {
  generateUnitTree(count, locations, levels);
};
