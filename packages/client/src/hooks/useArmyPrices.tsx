import { useMUD } from "../MUDContext";
import { useObservableValue } from "@latticexyz/react";
import { useState, useEffect } from "react";

export function useArmyPrices() {
    const { components } = useMUD();

    const prices = useObservableValue(components.ArmyPrices.update$);

    const [armyPrices, setArmyPrices] = useState<any>();

    useEffect(() => {
        if (prices) {
            setArmyPrices(prices.value[0]);
        }
    }, [prices]);

    return armyPrices;
}
