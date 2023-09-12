import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositions() {
  const { components } = useMUD();

  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  const value = useObservableValue(components.CastleOwnable.update$);

  const [castle, setCastle] = useState<any[]>([]);
  useEffect(() => {
    const positions = castleEntities.map((entityIndex) => {
      const castlePosition = getComponentValue(components.Position, entityIndex);
      const castleColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { castlePosition, castleColor }
    }

    );
    setCastle(positions);
  }, [castleEntities, value]);

  return castle;
}
