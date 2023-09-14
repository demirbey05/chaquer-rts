import { useMUD } from "../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export const useGameState = (gameID: number) => {
  const { components } = useMUD();
  const [gameState, setGameState] = useState<any>();
  const value = useComponentValue(
    components.GameMetaData,
    encodeEntity(components.GameMetaData.metadata.keySchema, {
      gameID: BigInt(gameID),
    })
  );

  useEffect(() => {
    if (value) {
      setGameState(value.state);
    }
  }, [value]);

  return gameState;
};
