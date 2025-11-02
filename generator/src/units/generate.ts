import { faker } from "../utils/faker.ts";
import type { UnitLevel } from "./data.ts";
import type { LocationRow } from "../locations/generate.ts";
import type { ServicemanRow } from "../servicemen/generate.ts";

export interface UnitData {
  name: string;
  level_id: number;
  location_id: number;
  children: UnitData[];
}

export type UnitRow = {
  id: number;
  name: string;
  parent_id: number | null;
  location_id: number;
  level_id: number;
};

const generateUnitNode = (
  locations: LocationRow[],
  levels: UnitLevel[],
  unitNamesSet: Set<string>
): UnitData => {
  let name: string;
  do {
    name = faker.word.words({ count: { min: 2, max: 4 } });
  } while (unitNamesSet.has(name));
  unitNamesSet.add(name);

  return {
    name,
    level_id: faker.helpers.arrayElement(levels).id,
    location_id: faker.helpers.arrayElement(locations).id,
    children: [],
  };
};

const traverseAndAssignParentIds = (start: UnitData): UnitRow[] => {
  const units: UnitRow[] = [];
  const stack = [{ node: start, parentId: null as number | null }];
  let currentId = 1;

  while (stack.length > 0) {
    const { node: currentNode, parentId } = stack.pop()!;

    units.push({
      id: currentId++,
      name: currentNode.name,
      parent_id: parentId,
      location_id: currentNode.location_id,
      level_id: currentNode.level_id,
    });

    for (const child of currentNode.children) {
      stack.push({ node: child, parentId: currentId - 1 });
    }
  }

  return units;
};

export const generateUnitsWithoutCaptain = (
  count: number,
  levels: UnitLevel[],
  locations: LocationRow[]
): UnitRow[] => {
  const unitNamesSet = new Set<string>();

  let remainingNodes = count;
  const rootNode: UnitData = generateUnitNode(locations, levels, unitNamesSet);

  remainingNodes--;

  let levelsWithNodes: UnitData[][] = [];
  for (let i = 0; i < levels.length; i++) {
    levelsWithNodes.push([]);
  }
  levelsWithNodes[0]!.push(rootNode);
  while (remainingNodes > 0) {
    const currentLevel =
      levelsWithNodes[
        faker.number.int({ min: 1, max: levelsWithNodes.length - 1 }) // Exclude root level
      ]!;
    currentLevel.push(generateUnitNode(locations, levels, unitNamesSet));
    remainingNodes--;
  }

  for (let level = 1; level < levelsWithNodes.length; level++) {
    const parentLevel = levelsWithNodes[level - 1]!;
    for (const node of levelsWithNodes[level]!) {
      const parentNode = faker.helpers.arrayElement(parentLevel);
      parentNode.children.push(node);
    }
  }

  return traverseAndAssignParentIds(rootNode);
};
