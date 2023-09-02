import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useCountOfPlayerSeed(gameID: number) {
    const { components } = useMUD();
    const [count, setCount] = useState<number>(0);
    const value = useComponentValue(components.PlayerSeeds, encodeEntity(components.PlayerSeeds.metadata.keySchema, { gameId: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setCount(value.seeds.length)
        }
    }, [value])
    return count;
}