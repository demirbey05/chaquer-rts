import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function usePlayerIsValid(gameID: number, address: string) {
    const { components } = useMUD();
    const [isPlayer, setIsPlayer] = useState<boolean>(false);
    const value = useComponentValue(components.Players, encodeEntity(components.Players.metadata.keySchema, { userAddress: address, gameId: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setIsPlayer(value.userValid)
        }
    }, [value])

    return isPlayer;
}