import type { RankCategoryRow, RankRow } from "../ranks/generate.ts";
import type {
  ServicemanDataRow,
  ServicemanRow,
} from "../servicemen/generate.ts";
import type { GeneratedUnitLevel } from "../units/data.ts";
import type { UnitLevelRow, UnitRow } from "../units/generate.ts";
import { dateYearsAgo } from "../utils/date.ts";
import { faker } from "../utils/faker.ts";
import { findOrThrow } from "../utils/findOrThrow.ts";

export type MemberRole = "MEMBER" | "COMMANDER";
export type UnitMember = {
  assigned_at: string;
  discharged_at: string | null;
  role: MemberRole;
  unit_id: number;
  serviceman_id: number;
};

export type RankedServicemenAndUnitMembers = {
  servicemenWithRanks: ServicemanRow[];
  unitMembers: UnitMember[];
};

export const assignRankAndMembersToUnits = (
  units: UnitRow[],
  levels: UnitLevelRow[],
  servicemen: ServicemanDataRow[],
  ranks: RankRow[],
  rankCategories: RankCategoryRow[]
): RankedServicemenAndUnitMembers => {
  // Business rules: captains can be assigned only if they are part of some
  const officerCategory = findOrThrow(
    rankCategories,
    (category) => category.name === "Офіцерський склад"
  );

  const officerRanks = [];
  const nonOfficerRanks = [];
  for (const rank of ranks) {
    if (rank.categoryId === officerCategory.id) {
      officerRanks.push(rank);
    } else {
      nonOfficerRanks.push(rank);
    }
  }

  const servicemenWithRanks: ServicemanRow[] = [];
  const unitMembers: UnitMember[] = [];

  const vzvodLevelValue = findOrThrow(
    levels,
    (level) => level.name === "Взвод"
  ).level;

  let servicemanIndex = 0;
  for (const unit of units) {
    const unitLevel = findOrThrow(
      levels,
      (level) => level.id === unit.level_id
    );
    const suitableRanks =
      unitLevel.level >= vzvodLevelValue ? nonOfficerRanks : officerRanks;
    servicemenWithRanks.push({
      ...servicemen[servicemanIndex]!,
      rankId: faker.helpers.arrayElement(suitableRanks).id,
    });

    if (servicemanIndex >= servicemen.length) {
      throw new Error("Not enough servicemen to assign to units");
    }

    let prevDischargeDate: Date | null = null;
    if (
      servicemanIndex < servicemen.length - 1 &&
      faker.datatype.boolean(0.1)
    ) {
      console.log("GENERATING PREV COMMANDER");
      const prevAssignedAt = faker.date.between({
        from: dateYearsAgo(5),
        to: dateYearsAgo(3),
      });
      prevDischargeDate = faker.date.between({
        from: prevAssignedAt,
        to: faker.date.between({
          from: prevAssignedAt,
          to: dateYearsAgo(2),
        }),
      });

      unitMembers.push({
        assigned_at: prevAssignedAt.toISOString(),
        discharged_at: prevDischargeDate.toISOString(),
        role: "COMMANDER",
        unit_id: unit.id,
        serviceman_id: servicemenWithRanks[servicemanIndex]!.id,
      });
      servicemanIndex++;

      servicemenWithRanks.push({
        ...servicemen[servicemanIndex]!,
        rankId: faker.helpers.arrayElement(suitableRanks).id,
      });
    }

    const assignedAt = prevDischargeDate
      ? faker.date
          .between({ from: prevDischargeDate, to: Date.now() })
          .toISOString()
      : faker.date.past({ years: 5 }).toISOString();

    unitMembers.push({
      assigned_at: assignedAt,
      discharged_at: null,
      role: "COMMANDER",
      unit_id: unit.id,
      serviceman_id: servicemenWithRanks[servicemanIndex]!.id,
    });

    servicemanIndex++;
  }

  if (servicemanIndex >= servicemen.length) {
    return { servicemenWithRanks, unitMembers };
  }

  for (; servicemanIndex < servicemen.length; servicemanIndex++) {
    const unit = faker.helpers.arrayElement(units);
    const assignedAt = faker.date.past({ years: 5 });

    unitMembers.push({
      assigned_at: assignedAt.toISOString(),
      discharged_at: faker.datatype.boolean(0.2)
        ? faker.date
            .between({
              from: assignedAt,
              to: new Date(),
            })
            .toISOString()
        : null,
      role: "MEMBER",
      unit_id: unit.id,
      serviceman_id: servicemen[servicemanIndex]!.id,
    });

    servicemenWithRanks.push({
      ...servicemen[servicemanIndex]!,
      rankId: faker.helpers.arrayElement(ranks).id,
    });
  }

  return { servicemenWithRanks, unitMembers };
};
