import { faker } from "../utils/faker.ts";

export type LocationRow = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
};

export const generateLocations = (count: number) => {
  const locations: LocationRow[] = [];
  const uniqueNames = new Set<string>();
  for (let i = 1; i <= count; i++) {
    let name: string;
    do {
      name = faker.location.city();
    } while (uniqueNames.has(name));
    uniqueNames.add(name);
    locations.push({
      id: i,
      name,
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
    });
  }
  return locations;
};
