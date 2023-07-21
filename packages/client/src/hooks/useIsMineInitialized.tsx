import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useIsMineInitialized(gameID: number) {
    const { network: { storeCache } } = useMUD();
    const isMineInited = useRow(storeCache, { table: "ResourceInited", key: { gameID: BigInt(gameID) } });
    return isMineInited;
}
