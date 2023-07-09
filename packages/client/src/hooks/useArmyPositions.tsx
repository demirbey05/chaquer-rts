import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArmyPositions() {
  const { components } = useMUD();

  // Get Army entities
  const armyEntities = useEntityQuery([Has(components.ArmyOwnable)]);
  const value = useObservableValue(components.Position.update$);

  // Transform army positions and store in separate state
  const [armyPositions, setArmyPositions] = useState<any[]>([]);
  const [armyConfig, setArmyConfig] = useState<any>(0);

  useEffect(() => {
    const positions = armyEntities.map((entityIndex) => {
      const position = getComponentValue(components.Position, entityIndex);
      const armyConfig = getComponentValue(components.ArmyConfig, entityIndex);
      return { position, armyConfig };
    });

    setArmyPositions(positions);
    setArmyConfig(armyConfig)
  }, [armyEntities, value]);

  // Return transformed army positions

  return [armyPositions, armyConfig];
}
