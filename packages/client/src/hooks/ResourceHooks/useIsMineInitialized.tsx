import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useIsMineInitialized(gameID: number) {
    const { components } = useMUD();
    const [isMineInited, setIsMineInited] = useState<boolean>(false);

    const value = useComponentValue(
        components.ResourceInited,
        encodeEntity(components.ResourceInited.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setIsMineInited(value.isInited)
        }
    }, [value])

    return isMineInited;
}
