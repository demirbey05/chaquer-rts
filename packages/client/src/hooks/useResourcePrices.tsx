import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useResourcePrices(gameID: number) {
    const { network: { storeCache } } = useMUD();
    const resourcePrices = useRow(storeCache, { table: "ResourcePrices", key: { gameID: BigInt(gameID) } });
    return resourcePrices;
}
