import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useCredit(gameID: number, address: string) {
    const { network: { storeCache } } = useMUD();
    const credit = useRow(storeCache, { table: "CreditOwn", key: { owner: address, gameID: BigInt(gameID) } });
    return credit;
}
