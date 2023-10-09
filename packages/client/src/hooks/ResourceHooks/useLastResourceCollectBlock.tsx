import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";
import { useCurrentBlockNumber } from "../useCurrentBlockNumber";

export function useLastResourceCollectBlock(gameID: number, owner: string) {
    const { components } = useMUD();

    const currentBlockNumber = useCurrentBlockNumber();

    const [lastBlock, setLastBlock] = useState<number>(0);
    const [blockDifference, setBlockDifference] = useState<number>(0);

    const value = useComponentValue(
        components.LastCollectTime,
        encodeEntity(components.LastCollectTime.metadata.keySchema, { gameID: BigInt(gameID), owner: owner })
    );

    useEffect(() => {
        if (value) {
            setLastBlock(Number(value.lastCollect))
        }
    }, [value])

    useEffect(() => {
        setBlockDifference(currentBlockNumber - lastBlock)
    }, [lastBlock, currentBlockNumber])

    return blockDifference;
}
