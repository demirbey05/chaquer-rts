import { useMUD } from "../context/MUDContext";
import { useComponentValue, useObservableValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export const useSyncProgress = () => {
    const { components } = useMUD();

    const progress = useComponentValue(components.SyncProgress, "0x" as Entity);
    const value = useObservableValue(components.SyncProgress.update$);

    const [percentage, setPercentage] = useState<ComponentValue<{
        step: string,
        message: string,
        percentage: number,
        latestBlockNumber: BigInt,
        lastBlockNumberProcessed: BigInt
    }, unknown> | undefined>();

    useEffect(() => {
        if (progress) {
            setPercentage(progress)
        }
    }, [progress, value]);

    return percentage;
}