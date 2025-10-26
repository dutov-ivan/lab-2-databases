import type { PhysicalUnit, units } from "./data/units";

export type AllowedUnits = (typeof units)[number];

export type MeasurementUnitTable = {
  id: number;
  name: string;
  abbreviation: string;
};

export const initializeUnits = (
  units: PhysicalUnit[]
): MeasurementUnitTable[] => {
  return units.map((unit, index) => ({
    id: index + 1,
    name: unit.name,
    abbreviation: unit.abbreviation,
  }));
};
