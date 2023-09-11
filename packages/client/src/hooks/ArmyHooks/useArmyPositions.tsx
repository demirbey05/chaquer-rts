import { useMUD } from "../../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArmyPositions() {
  const { components } = useMUD();

  const armyEntities = useEntityQuery([Has(components.ArmyOwnable)]);
  const value = useObservableValue(components.Position.update$);

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

  return [armyPositions, armyConfig];
}
