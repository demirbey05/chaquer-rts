import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositions(gameID: number) {
  const { components } = useMUD();

  const castleEntities = useEntityQuery([
    HasValue(components.CastleOwnable, { gameID: BigInt(gameID) }),
  ]);
  const valuePos = useObservableValue(components.CastleOwnable.update$);
  const valueCol = useObservableValue(components.ColorOwnable.update$);

  const [castle, setCastle] = useState<any[]>([]);
  useEffect(() => {
    const positions = castleEntities.map((entityIndex) => {
      const castlePosition = getComponentValue(components.Position, entityIndex);
      const castleColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { castlePosition, castleColor }
    });

    setCastle(positions);
  }, [castleEntities, valuePos, valueCol]);

  return castle;
}