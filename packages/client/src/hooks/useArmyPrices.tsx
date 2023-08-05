import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";

export function useArmyPrices(gameID: number) {
    const { network: { storeCache } } = useMUD();
    const armyPrices = useRow(storeCache, { table: "ArmyPrices", key: { gameID: BigInt(gameID) } });
    return armyPrices;
}
