import { useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { Type, ComponentValue } from "@latticexyz/recs";
import { useEffect, useState } from "react";
import { BoundedQueue } from "../utils/structs/BoundedQueue";

type battleRecord = {
    winner: Type.String;
    loser: Type.String;
    isDraw: Type.Boolean;
}

export function useScoreTable(maxElementSize: number) {
    const { components } = useMUD()
    const update = useObservableValue(components.BattleResult.update$);
    const [lastFive, setLastFive] = useState<BoundedQueue<ComponentValue<battleRecord, undefined> | undefined>>(new BoundedQueue(maxElementSize))

    useEffect(() => {
        setLastFive(n => { n.enqueue(update?.value[0]); return n })
    }, [update])

    return lastFive
}