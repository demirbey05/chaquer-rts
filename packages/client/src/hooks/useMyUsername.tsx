import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useMyUsername(gameID: number, address: string) {
    const { components } = useMUD();
    const [username, setUsername] = useState<any>(0);
    const value = useComponentValue(components.AddressToUsername, encodeEntity(components.AddressToUsername.metadata.keySchema, { ownerAddress: address, gameId: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setUsername(value.userName)
        }
    }, [value])

    return username;
}