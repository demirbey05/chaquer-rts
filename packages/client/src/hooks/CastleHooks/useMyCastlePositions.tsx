import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../context/MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyCastlePositions(address: any, gameID: number) {
  const { components } = useMUD();

  const castleEntity = useEntityQuery([HasValue(components.CastleOwnable, { owner: address, gameID: BigInt(gameID) })]);

  const [castle, setCastle] = useState<any>();
  const valuePos = useObservableValue(components.CastleOwnable.update$);
  const valueCol = useObservableValue(components.ColorOwnable.update$);

  useEffect(() => {
    const castlePosition = castleEntity.map((entityIndex) => {
      const myCastlePosition = getComponentValue(components.Position, entityIndex);
      const myCastleColor = getComponentValue(components.ColorOwnable, entityIndex);
      return { myCastlePosition, myCastleColor }
    })
    setCastle(castlePosition);
  }, [castleEntity, valueCol, valuePos]);

  return castle;
}