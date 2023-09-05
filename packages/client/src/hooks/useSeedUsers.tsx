import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useSeedUsers(gameID: number, address: string) {
    const { components } = useMUD();
    const [seedEntereed, setSeedEntered] = useState<boolean>(false);
    const value = useComponentValue(components.SeedInited, encodeEntity(components.SeedInited.metadata.keySchema, { gameId: BigInt(gameID), user: address }));

    useEffect(() => {
        if (value) {
            setSeedEntered(value.seedInit)
        }
    }, [value])
    return seedEntereed;
}