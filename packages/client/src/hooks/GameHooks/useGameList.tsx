import { useState, useEffect } from 'react'
import { useMUD } from "../../context/MUDContext"
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, Has } from "@latticexyz/recs";

export const useGameList = () => {
    const { components } = useMUD();

    const gameEntities = useEntityQuery([Has(components.GameMetaData)]);
    const value = useObservableValue(components.GameMetaData.update$);

    const [gameList, setGameList] = useState<any[]>([]);

    useEffect(() => {
        const games = gameEntities.map((entityIndex) => {
            return getComponentValue(components.GameMetaData, entityIndex);
        });

        setGameList(games)
    }, [gameEntities, value]);

    return gameList;
}