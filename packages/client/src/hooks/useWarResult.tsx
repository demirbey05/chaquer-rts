import { useObservableValue } from "@latticexyz/react";
import { useMUD } from "../context/MUDContext";
import { useEffect, useState } from "react";

export function useWarResult(maxElementSize: number) {
    const { components } = useMUD()

    const warResult = useObservableValue(components.ClashResult.update$);

    const [lastFive, setLastFive] = useState<any[]>([]);

    useEffect(() => {
        if (warResult) {
            setLastFive((prevResults) => [
                ...prevResults.slice(-maxElementSize + 1),
                warResult?.value[0]
            ]);
        }
    }, [warResult])

    return lastFive;
}
