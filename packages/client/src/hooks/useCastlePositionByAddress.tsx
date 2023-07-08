import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useCastlePositionByAddress(address: any) {
  const { components } = useMUD();

  const castleEntity = useEntityQuery([HasValue(components.CastleOwnable, { value: address })]);

  const [castlePositions, setCastlePositions] = useState<any>();
  const value = useObservableValue(components.CastleOwnable.update$);

  useEffect(() => {
    const castlePosition = castleEntity.map((entityIndex) => {
      return getComponentValue(components.Position, entityIndex);
    })
    setCastlePositions(castlePosition);
  }, [castleEntity, value]);

  return castlePositions;
}
