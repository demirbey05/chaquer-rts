import { useState, useEffect } from 'react'
import { useMUD } from "../../context/MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { encodeEntity } from "@latticexyz/store-sync/recs";
import { calculateResource } from "../../utils/helperFunctions/ResourceFuntions/calculateResult";
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from "../../context/GameContext";
import { useLastResourceCollectBlock } from './useLastResourceCollectBlock';
import { useMyResourceEntityNumber } from './useResources';

export function useNumberOfResource(address: string, gameID: number) {
    const { components } = useMUD();
    const numberOfResources = useComponentValue(components.ResourceOwn, encodeEntity(components.ResourceOwn.metadata.keySchema, { owner: address, gameID: BigInt(gameID) }));
    return numberOfResources;
}

export const useNumberOfFood = () => {
    const [foodNumber, setFoodNumber] = useState<number>(0);

    const { userWallet } = usePlayer()
    const { gameID } = useGame()

    const numberOfResources = useNumberOfResource(userWallet, gameID)
    const lastCollectBlockNumber = useLastResourceCollectBlock(gameID, userWallet)
    const resourceEntityNumber = useMyResourceEntityNumber(gameID, userWallet, 0)

    useEffect(() => {
        if (numberOfResources && lastCollectBlockNumber >= 1) {
            const newFoodNumber = calculateResource(Number(numberOfResources.numOfFood), lastCollectBlockNumber, resourceEntityNumber)
            setFoodNumber(newFoodNumber)
        }
    }, [numberOfResources])

    numberOfResources && console.log("BC:" + Number(numberOfResources.numOfFood))
    console.log("Client:" + foodNumber)
    return foodNumber
}

export const useNumberOfWood = () => {
    const [woodNumber, setWoodNumber] = useState<number>(0);

    const { userWallet } = usePlayer()
    const { gameID } = useGame()

    const numberOfResources = useNumberOfResource(userWallet, gameID)
    const lastCollectBlockNumber = useLastResourceCollectBlock(gameID, userWallet)
    const resourceEntityNumber = useMyResourceEntityNumber(gameID, userWallet, 1)

    useEffect(() => {
        if (numberOfResources && lastCollectBlockNumber >= 1) {
            const newWoodNumber = calculateResource(Number(numberOfResources.numOfWood), lastCollectBlockNumber, resourceEntityNumber)
            setWoodNumber(newWoodNumber)
        }
    }, [numberOfResources])

    return woodNumber
}

export const useNumberOfDiomand = () => {
    const [diomandNumber, setDiomandNumber] = useState<number>(0);

    const { userWallet } = usePlayer()
    const { gameID } = useGame()

    const numberOfResources = useNumberOfResource(userWallet, gameID)
    const lastCollectBlockNumber = useLastResourceCollectBlock(gameID, userWallet)
    const resourceEntityNumber = useMyResourceEntityNumber(gameID, userWallet, 2)

    useEffect(() => {
        if (numberOfResources && lastCollectBlockNumber >= 1) {
            const newDiomandNumber = calculateResource(Number(numberOfResources.numOfGold), lastCollectBlockNumber, resourceEntityNumber)
            setDiomandNumber(newDiomandNumber)
        }
    }, [numberOfResources])

    return diomandNumber
}
