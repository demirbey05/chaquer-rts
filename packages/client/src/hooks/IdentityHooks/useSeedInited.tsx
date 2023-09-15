import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useSeedInited(gameID: number, address: string) {
    const { components } = useMUD();
    const [seedInited, setSeedInited] = useState<boolean>(false);
    const value = useComponentValue(components.SeedInited, encodeEntity(components.SeedInited.metadata.keySchema, { gameId: BigInt(gameID), user: address }));

    useEffect(() => {
        if (value) {
            setSeedInited(value.seedInit)
        }
    }, [value])
    return seedInited;
}