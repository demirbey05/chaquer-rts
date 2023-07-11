import { useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { useEffect, useState } from "react";
import { BoundedQueue } from "../utils/structs/BoundedQueue";
import { ComponentValue } from "@latticexyz/recs";

export function useWarResult(maxElementSize: number) {
    const { components } = useMUD()

    const armyWarResult = useObservableValue(components.BattleResult.update$);
    const castleCaptureResult = useObservableValue(components.CastleSiegeResult.update$);

    const [lastFive, setLastFive] = useState<BoundedQueue<ComponentValue<any, undefined>>>(new BoundedQueue(maxElementSize))

    useEffect(() => {
        if (armyWarResult) {
            setLastFive((n: any) => { n.enqueue({ data: armyWarResult?.value[0], type: "army" }); return n })
        }
    }, [armyWarResult])

    useEffect(() => {
        if (castleCaptureResult) {
            setLastFive((n: any) => { n.enqueue({ data: castleCaptureResult?.value[0], type: "castle" }); return n })
        }
    }, [castleCaptureResult])

    return lastFive;
}