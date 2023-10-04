import { useState, useEffect } from "react";
import { useMUD } from "../../context/MUDContext";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useComponentValue } from "@latticexyz/react";

export function useArmyPrices(gameID: number) {
    const { components } = useMUD();
    const [armyPrices, setArmyPrices] = useState<any>();
    const value = useComponentValue(components.ArmyPrices, encodeEntity(components.ArmyPrices.metadata.keySchema, { gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setArmyPrices(value)
        }
    }, [value])

    return armyPrices;
}
