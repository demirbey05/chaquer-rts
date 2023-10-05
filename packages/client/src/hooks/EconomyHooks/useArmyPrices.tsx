import { useState, useEffect } from "react";
import { createPublicClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { useGame } from "../../context/GameContext";
import { useSoldierCreated } from "../../hooks/EconomyHooks/useSoldierCreated";
import { useGameData } from "../../hooks/useGameData";
import { getArmyVRGDAPrice } from "../../vrgda/getVRGDAPrice";

export function useArmyPrices() {
    const publicClient = createPublicClient({
        chain: foundry,
        transport: http()
    })

    const { gameID } = useGame();
    const gameData = useGameData(gameID);
    const soldierCreated = useSoldierCreated(gameID);

    const [swordsmanPrice, setSwordsmanPrice] = useState<number>(0);
    const [archerPrice, setArcherPrice] = useState<number>(0);
    const [cavalryPrice, setCavalryPrice] = useState<number>(0);

    const [currentBlockNumber, setCurrentBlockNumber] = useState<number>(0);

    useEffect(() => {
        const fetchBlockNumber = async () => {
            const blockNumber = await publicClient.getBlockNumber()
            setCurrentBlockNumber(Number(blockNumber))
        }

        const intervalId = setInterval(fetchBlockNumber, 1000);

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        if (gameData) {
            const startBlock = Number(gameData.startBlock)
            const time = currentBlockNumber - startBlock;
            const numberOfPlayer = Number(gameData.numberOfPlayer);

            const createdSwordmans = Number(soldierCreated.numOfSwordsman)
            const createdArcher = Number(soldierCreated.numOfArcher)
            const createdCavalry = Number(soldierCreated.numOfCavalry)

            const newSwordsmanPrice = getArmyVRGDAPrice(createdSwordmans, time, numberOfPlayer)
            const newArcherPrice = getArmyVRGDAPrice(createdArcher, time, numberOfPlayer)
            const newCavalryPrice = getArmyVRGDAPrice(createdCavalry, time, numberOfPlayer)

            setSwordsmanPrice(newSwordsmanPrice)
            setArcherPrice(newArcherPrice)
            setCavalryPrice(newCavalryPrice)
        }
    }, [gameData, currentBlockNumber, soldierCreated])

    return { swordsmanPrice: swordsmanPrice, archerPrice: archerPrice, cavalryPrice: cavalryPrice }
}
