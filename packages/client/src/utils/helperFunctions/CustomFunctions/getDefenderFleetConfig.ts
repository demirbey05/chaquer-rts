import {
  Entity,
  HasValue,
  getComponentValueStrict,
  runQuery,
} from "@latticexyz/recs";

export function getDefenderFleetConfig(
  EntityID: Entity,
  Position: any,
  DefenderOwnable: any,
  FleetOwnable: any,
  FleetConfig: any,
  gameID: number
) {
  const acc = { numSmall: 0, numMedium: 0, numBig: 0 };

  const resourcePosition = getComponentValueStrict(Position, EntityID);
  const defenderOwnable = getComponentValueStrict(DefenderOwnable, EntityID);
  const allFleets = runQuery([
    HasValue(FleetOwnable, {
      owner: defenderOwnable.owner,
      gameID: BigInt(gameID),
    }),
  ]);
  allFleets.forEach((element) => {
    const positionOfFleet = getComponentValueStrict(Position, element);

    // Calculating manhattan distance
    const distance =
      Math.abs((positionOfFleet.x as number) - (resourcePosition.x as number)) +
      Math.abs((positionOfFleet.y as number) - (resourcePosition.y as number));

    if (distance <= 3) {
      const fleetConfig = getComponentValueStrict(FleetConfig, element);
      acc.numSmall += fleetConfig.numSmall as number;
      acc.numMedium += fleetConfig.numMedium as number;
      acc.numBig += fleetConfig.numBig as number;
    }
  });
  return acc;
}
