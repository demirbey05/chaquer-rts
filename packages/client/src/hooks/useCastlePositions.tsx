import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositions() {
  const { components } = useMUD();

  // Get Castle entities
  const castleEntities = useEntityQuery([Has(components.CastleOwnable)]);
  const value = useObservableValue(components.CastleOwnable.update$);

  // Transform castle positions and store in separate state
  const [castlePositions, setCastlePositions] = useState<any[]>([]);
  useEffect(() => {
    const positions = castleEntities.map((entityIndex) =>
      getComponentValue(components.Position, entityIndex)
    );
    setCastlePositions(positions);
  }, [castleEntities, value]);

  // Return transformed castle positions
  return castlePositions;
}
