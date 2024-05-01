import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export const useCivilization = (gameID: number, address: any) => {
    const { components } = useMUD();

    const castleEntitites = useEntityQuery([
        HasValue(components.CastleOwnable, { owner: address, gameID: BigInt(gameID) }),
    ]);

    const [myCivilization, setMyCivilization] = useState<number | null>(null);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    useEffect(() => {
        const castle = castleEntitites.map((entityIndex) => {
            const myCastleColor = getComponentValue(components.ColorOwnable, entityIndex);
            return myCastleColor;
        });

        setMyCivilization(Number(castle[0]?.nation))
    }, [castleEntitites, valueCol]);

    return myCivilization;
}