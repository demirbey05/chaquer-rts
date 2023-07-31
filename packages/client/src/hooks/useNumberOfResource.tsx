import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useNumberOfResource(address: string, gameID: number) {
    const { network: { storeCache } } = useMUD();
    const numberOfResources = useRow(storeCache, { table: "ResourceOwn", key: { owner: address, gameID: BigInt(gameID) } });
    return numberOfResources;
}
