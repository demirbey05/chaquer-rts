import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useResourcePrices(gameID: number) {
    const { components } = useMUD();
    const [resourcePrices, setResourcePrices] = useState<any>();
    const value = useComponentValue(components.ResourcePrices, encodeEntity(components.ResourcePrices.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setResourcePrices(value)
        }
    }, [value])

    return resourcePrices;
}
