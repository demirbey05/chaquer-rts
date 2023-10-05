import { useState, useEffect } from "react";
import { createPublicClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { useGame } from "../../context/GameContext";
import { useGameData } from "../../hooks/useGameData";
import { getResourceVRGDAPrice } from "../../vrgda/getVRGDAPrice";
import { useResourcesInStoke } from "../../hooks/EconomyHooks/useResourcesInStoke";

export function useResourcePrices() {
    const publicClient = createPublicClient({
        chain: foundry,
        transport: http()
    })

    const { gameID } = useGame();
    const gameData = useGameData(gameID);
    const resourceSold = useResourcesInStoke(gameID);

    const [foodPrice, setFoodPrice] = useState<number>(0);
    const [woodPrice, setWoodPrice] = useState<number>(0);
    const [goldPrice, setGoldPrice] = useState<number>(0);

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
        if (gameData && resourceSold) {
            const startBlock = Number(gameData.startBlock)
            const time = currentBlockNumber - startBlock;
            const numberOfPlayer = Number(gameData.numberOfPlayer);

            const soldFood = Number(resourceSold.foodSold)
            const soldWood = Number(resourceSold.woodSold)
            const soldGold = Number(resourceSold.goldSold)

            const newFoodPrice = getResourceVRGDAPrice(soldFood, time, numberOfPlayer)
            const newWoodPrice = getResourceVRGDAPrice(soldWood, time, numberOfPlayer)
            const newGoldPrice = getResourceVRGDAPrice(soldGold, time, numberOfPlayer)

            setFoodPrice(newFoodPrice)
            setWoodPrice(newWoodPrice)
            setGoldPrice(newGoldPrice)
        }
    }, [gameData, currentBlockNumber, resourceSold])

    return { foodPrice: foodPrice, woodPrice: woodPrice, goldPrice: goldPrice }
}
