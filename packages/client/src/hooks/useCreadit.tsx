import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useCredit(gameID: number, address: string) {
    const { network: { storeCache } } = useMUD();
    const creadit = useRow(storeCache, { table: "CreditOwn", key: { owner: address, gameID: BigInt(gameID) } });
    return creadit;
}
