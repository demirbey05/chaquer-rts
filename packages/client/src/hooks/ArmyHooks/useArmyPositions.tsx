import { useMUD } from "../../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArmyPositions() {
  const { components } = useMUD();

  const armyEntities = useEntityQuery([Has(components.ArmyOwnable)]);
  const value = useObservableValue(components.Position.update$);

  const [army, setArmy] = useState<any[]>([]);

  useEffect(() => {
    const army = armyEntities.map((entityIndex) => {
      const armyPosition = getComponentValue(components.Position, entityIndex);
      const armyConfig = getComponentValue(components.ArmyConfig, entityIndex);
      const armyColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { armyPosition, armyConfig, armyColor };
    });

    setArmy(army)
  }, [armyEntities, value]);

  return army;
}
