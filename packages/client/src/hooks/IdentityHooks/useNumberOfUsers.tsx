import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useNumberOfUsers(gameID: number) {
    const { components } = useMUD();
    const [numberOfUsers, setNumberOfUsers] = useState(0);

    const value = useComponentValue(components.GameMetaData,
        encodeEntity(components.GameMetaData.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setNumberOfUsers(Number(value.numberOfPlayer));
        }
    }, [value])
    return numberOfUsers;
}
