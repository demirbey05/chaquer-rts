import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyArmy(address: any) {
  const { components } = useMUD();

  const armyEntities = useEntityQuery([
    HasValue(components.ArmyOwnable, { owner: address }),
  ]);

  const [myArmy, setMyArmy] = useState<any[]>([]);
  const valuePos = useObservableValue(components.Position.update$);
  const valueCfg = useObservableValue(components.ArmyConfig.update$);
  const valueCol = useObservableValue(components.ColorOwnable.update$);

  useEffect(() => {
    const army = armyEntities.map((entityIndex) => {
      const myArmyPosition = getComponentValue(components.Position, entityIndex);
      const myArmyConfig = getComponentValue(components.ArmyConfig, entityIndex);
      const myArmyColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { myArmyPosition, myArmyConfig, myArmyColor };
    });

    setMyArmy(army)
  }, [armyEntities, valuePos, valueCfg, valueCol]);

  return myArmy;
}