import { useMUD } from "../../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export const useWinnerAddress = (gameID: number) => {
    const { components } = useMUD();
    const [winner, setWinner] = useState<string>();
    const value = useComponentValue(
        components.GameMetaData,
        encodeEntity(components.GameMetaData.metadata.keySchema, {
            gameID: BigInt(gameID),
        })
    );

    useEffect(() => {
        if (value) {
            setWinner(value.winner);
        }
    }, [value]);

    return winner;
};
