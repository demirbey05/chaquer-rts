import { useMUD } from "../MUDContext";
import { useRow } from "@latticexyz/react";


export function useNumberOfUsers(gameID: number) {
    const {
        network: { storeCache },
    } = useMUD();
    const NumberOfUsers = useRow(storeCache, { table: "NumberOfUsers", key: { gameId: BigInt(gameID) } });
    return NumberOfUsers;
}
