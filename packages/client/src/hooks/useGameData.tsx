import { useMUD } from "../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export const useGameData = (gameID: number) => {
    const { components } = useMUD();
    const [gameData, setGameData] = useState<any>();
    const value = useComponentValue(
        components.GameMetaData,
        encodeEntity(components.GameMetaData.metadata.keySchema, {
            gameID: BigInt(gameID),
        })
    );

    useEffect(() => {
        if (value) {
            setGameData(value);
        }
    }, [value]);

    return gameData;
};