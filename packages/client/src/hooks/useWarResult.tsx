import { useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { useEffect, useState } from "react";
import { ComponentValue } from "@latticexyz/recs";

export function useWarResult(maxElementSize: number) {
    const { components } = useMUD()

    const armyWarResult = useObservableValue(components.BattleResult.update$);
    const castleCaptureResult = useObservableValue(components.CastleSiegeResult.update$);
    const mineCaptureResult = useObservableValue(components.MineCaptureResult.update$);

    const [lastFive, setLastFive] = useState<ComponentValue<any, undefined>[]>([]);

    useEffect(() => {
        if (armyWarResult) {
            setLastFive((prevResults) => [
                ...prevResults.slice(-maxElementSize + 1),
                { data: armyWarResult?.value[0], type: "army" },
            ]);
        }
    }, [armyWarResult])

    useEffect(() => {
        if (castleCaptureResult) {
            setLastFive((prevResults) => [
                ...prevResults.slice(-maxElementSize + 1),
                { data: castleCaptureResult?.value[0], type: "castle" },
            ]);
        }
    }, [castleCaptureResult])

    useEffect(() => {
        if (mineCaptureResult) {
            setLastFive((prevResults) => [
                ...prevResults.slice(-maxElementSize + 1),
                { data: mineCaptureResult?.value[0], type: "mine" },
            ]);
        }
    }, [mineCaptureResult])

    return lastFive;
}
