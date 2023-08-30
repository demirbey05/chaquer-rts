import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useNumberOfUsers(gameID: number) {
    const { components } = useMUD();
    const [numberOfUsers, setNumberOfUsers] = useState(0);

    const value = useComponentValue(components.NumberOfUsers,
        encodeEntity(components.NumberOfUsers.metadata.keySchema, { gameId: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setNumberOfUsers(Number(value.numOfUsers));
        }
    }, [value])
    return numberOfUsers;
}
