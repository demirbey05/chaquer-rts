import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useSeedUsers(gameID: number) {
    const { components } = useMUD();
    const [seeds, setSeeds] = useState<string[]>();
    const value = useComponentValue(components.PlayerSeeds, encodeEntity(components.PlayerSeeds.metadata.keySchema, { gameId: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setSeeds(value.seedUsers)
        }
    }, [value])
    return seeds;
}