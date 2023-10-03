import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArmyPositions(gameID: number) {
  const { components } = useMUD();

  const armyEntities = useEntityQuery([
    HasValue(components.ArmyOwnable, { gameID: BigInt(gameID) }),
  ]);
  const valuePos = useObservableValue(components.Position.update$);
  const valueCfg = useObservableValue(components.ArmyConfig.update$);
  const valueCol = useObservableValue(components.ColorOwnable.update$);

  const [army, setArmy] = useState<any[]>([]);

  useEffect(() => {
    const army = armyEntities.map((entityIndex) => {
      const armyPosition = getComponentValue(components.Position, entityIndex);
      const armyConfig = getComponentValue(components.ArmyConfig, entityIndex);
      const armyColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { armyPosition, armyConfig, armyColor };
    });

    setArmy(army)
  }, [armyEntities, valuePos, valueCfg, valueCol]);

  return army;
}