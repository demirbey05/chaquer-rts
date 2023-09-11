import { useMUD } from "../../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";

export function useNumberOfResource(address: string, gameID: number) {
    const { components } = useMUD();
    const numberOfResources = useComponentValue(components.ResourceOwn, encodeEntity(components.ResourceOwn.metadata.keySchema, { owner: address, gameID: BigInt(gameID) }));
    return numberOfResources;
}
