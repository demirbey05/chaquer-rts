import {
  Entity,
  HasValue,
  getComponentValueStrict,
  runQuery,
} from "@latticexyz/recs";

export function findCastleCloseArmies(
  castleID: Entity,
  Position: any,
  CastleOwnable: any,
  ArmyOwnable: any,
  ArmyConfig: any,gameID:number
) {
  const acc = { numSwordsman: 0, numArcher: 0, numCavalry: 0 };

  const castlePosition = getComponentValueStrict(Position, castleID);
  const castleOwner = getComponentValueStrict(CastleOwnable, castleID);
  const allArmies = runQuery([
    HasValue(ArmyOwnable, { owner: castleOwner.owner,gameID:gameID }),
  ]);
  allArmies.forEach((element) => {
    const positionOfArmy = getComponentValueStrict(Position, element);

    // Calculating manhattan distance
    const distance =
      Math.abs((positionOfArmy.x as number) - (castlePosition.x as number)) +
      Math.abs((positionOfArmy.y as number) - (castlePosition.y as number));

    if (distance <= 3) {
      const armyConfiguration = getComponentValueStrict(ArmyConfig, element);
      acc.numSwordsman += armyConfiguration.numSwordsman as number;
      acc.numArcher += armyConfiguration.numArcher as number;
      acc.numCavalry += armyConfiguration.numCavalry as number;
    }
  });
  return acc;
}
