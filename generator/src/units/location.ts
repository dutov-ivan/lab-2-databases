import { faker } from "../utils/faker";

export type LocationRow = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
};

export const generateLocations = (count: number) => {
  const locations: LocationRow[] = [];
  for (let i = 1; i <= count; i++) {
    locations.push({
      id: i,
      name: faker.location.city(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
    });
  }
  return locations;
};
