import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { useState, useEffect } from "react";

export function useCredit(gameID: number, address: string) {
    const { components } = useMUD();
    const [credit, setCredit] = useState<any>(0);
    const value = useComponentValue(components.CreditOwn, encodeEntity(components.CreditOwn.metadata.keySchema, { owner: address, gameID: BigInt(gameID) }));

    useEffect(() => {
        if (value) {
            setCredit(value.amount)
        }
    }, [value])

    return credit;
}