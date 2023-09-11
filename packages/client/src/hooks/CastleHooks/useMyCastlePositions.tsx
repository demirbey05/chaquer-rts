import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyCastlePositions(address: any) {
  const { components } = useMUD();

  const castleEntity = useEntityQuery([HasValue(components.CastleOwnable, { owner: address })]);

  const [castle, setCastle] = useState<any>();
  const value = useObservableValue(components.CastleOwnable.update$);

  useEffect(() => {
    const castlePosition = castleEntity.map((entityIndex) => {
      const myCastlePosition = getComponentValue(components.Position, entityIndex);
      const myCastleColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { myCastlePosition, myCastleColor }
    })
    setCastle(castlePosition);
  }, [castleEntity, value]);

  return castle;
}
