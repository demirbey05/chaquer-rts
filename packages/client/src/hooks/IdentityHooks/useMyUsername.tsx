import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useMyUsername(gameID: number, address: string) {
    const { components } = useMUD();
    const [username, setUsername] = useState<any>();
    const value = useComponentValue(components.AddressToUsername, encodeEntity(components.AddressToUsername.metadata.keySchema, { ownerAddress: address }));

    useEffect(() => {
        if (value) {
            setUsername(value.userName)
        }
    }, [value])

    return username;
}