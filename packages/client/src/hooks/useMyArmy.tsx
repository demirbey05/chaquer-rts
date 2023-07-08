import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue, Type } from "@latticexyz/recs";
import { useState, useEffect, useRef } from "react";

export function useMyArmy(address: any) {
  const { components } = useMUD();

  // Get Army entities
  const armyEntities = useEntityQuery([
    HasValue(components.ArmyOwnable, { value: address }),
  ]);

  // Transform army positions and store in separate state
  const [armyPositions, setArmyPositions] = useState<any[]>([]);
  const [userArmyNumber, setUserArmyNumber] = useState<number>(0);
  const value = useObservableValue(components.Position.update$);

  useEffect(() => {
    const positions = armyEntities.map((entityIndex) => {
      const position = getComponentValue(components.Position, entityIndex);
      const armyConfig = getComponentValue(components.ArmyConfig, entityIndex);
      return { position, armyConfig };
    });

    setArmyPositions(positions);
    setUserArmyNumber(positions.length);
  }, [armyEntities, value]);

  // Return transformed army positions
  return [armyPositions, userArmyNumber];
}
