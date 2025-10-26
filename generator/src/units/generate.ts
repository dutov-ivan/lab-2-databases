import type { MeasurementUnit, UNITS } from "./data";

export type AllowedUnits = (typeof UNITS)[number];

export type MeasurementUnitRow = {
  id: number;
  name: string;
  abbreviation: string;
};

export const generateUnitTable = (
  units: MeasurementUnit[]
): MeasurementUnitRow[] => {
  return units.map((unit, index) => ({
    id: index + 1,
    name: unit.name,
    abbreviation: unit.abbreviation,
  }));
};
