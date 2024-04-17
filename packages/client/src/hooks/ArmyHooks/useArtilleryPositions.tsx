import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useArtilleryPositions(gameID: number) {
    const { components } = useMUD();

    const artilleryEntities = useEntityQuery([
        HasValue(components.ArtilleryOwnable, { gameID: BigInt(gameID) }),
    ]);
    const valuePos = useObservableValue(components.Position.update$);
    const valueCfg = useObservableValue(components.ArtilleryConfig.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    const [artillery, setArtillery] = useState<any[]>([]);

    useEffect(() => {
        const army = artilleryEntities.map((entityIndex) => {
            const artilleryPosition = getComponentValue(components.Position, entityIndex);
            const artilleryConfig = getComponentValue(components.ArtilleryConfig, entityIndex);
            const artilleryColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { artilleryPosition, artilleryConfig, artilleryColor };
        });

        setArtillery(army)
    }, [artilleryEntities, valuePos, valueCfg, valueCol]);

    return artillery;
}