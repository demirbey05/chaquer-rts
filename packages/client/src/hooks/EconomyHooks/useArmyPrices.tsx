import { useMUD } from "../../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

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
