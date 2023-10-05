import { useState, useEffect } from "react";
import { useMUD } from "../../context/MUDContext";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useComponentValue } from "@latticexyz/react";

export function useSoldierCreated(gameID: number) {
    const { components } = useMUD();
    const [soldiers, setSoldiers] = useState<any>({ numOfSwordsman: 0, numOfArcher: 0, numOfCavalry: 0 });
    const value = useComponentValue(components.SoldierCreated, encodeEntity(components.SoldierCreated.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setSoldiers(value)
        }
    }, [value])

    return soldiers;
}
