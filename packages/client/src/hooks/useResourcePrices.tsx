import { useMUD } from "../MUDContext";
import { useObservableValue } from "@latticexyz/react";
import { useState, useEffect } from "react";

export function useResourcePrices() {
    const { components } = useMUD();

    const prices = useObservableValue(components.ResourcePrices.update$);

    const [resourcePrices, setResourcePrices] = useState<any>();

    useEffect(() => {
        if (prices) {
            setResourcePrices(prices.value[0]);
        }
    }, [prices]);

    return resourcePrices;
}
