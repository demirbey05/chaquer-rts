import { useMUD } from "../context/MUDContext";
import { useEffect, useState } from "react";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { HasValue, getComponentValueStrict } from "@latticexyz/recs";

export function useWarResult(maxElementSize: number, gameID: number) {
    const { components } = useMUD()

    const warEntity = useEntityQuery([
        HasValue(components.ClashResult, { gameID: BigInt(gameID) }),
    ]);
    const value = useObservableValue(components.ClashResult.update$);

    const [warResults, setWarResults] = useState<any[]>([]);

    useEffect(() => {
        const newWars = warEntity.map((entityIndex) => {
            const newWar = getComponentValueStrict(components.ClashResult, entityIndex);
            return newWar;
        });

        const limitedWars = newWars.slice(-maxElementSize);

        setWarResults(limitedWars);
    }, [warEntity, value]);

    return warResults;
}