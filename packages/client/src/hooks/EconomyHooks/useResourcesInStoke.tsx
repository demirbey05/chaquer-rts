import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useResourcesInStoke(gameID: number) {
    const { components } = useMUD();
    const [resources, setResources] = useState<any>();

    const value = useComponentValue(
        components.ResourcesSold,
        encodeEntity(components.ResourcesSold.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setResources(value)
        }
    }, [value])

    return resources;
}
