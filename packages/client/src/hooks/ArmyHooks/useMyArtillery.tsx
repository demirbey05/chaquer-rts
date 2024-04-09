import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { getComponentValue, HasValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyArtillery(address: any, gameID: number) {
    const { components } = useMUD();

    const armyEntities = useEntityQuery([
        HasValue(components.ArtilleryOwnable, { owner: address, gameID: BigInt(gameID) }),
    ]);

    const [myArtillery, setMyArtillery] = useState<any[]>([]);

    const valuePos = useObservableValue(components.Position.update$);
    const valueCfg = useObservableValue(components.ArtilleryConfig.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    useEffect(() => {
        const artillery = armyEntities.map((entityIndex) => {
            const myArtilleryPosition = getComponentValue(components.Position, entityIndex);
            const myArtilleryConfig = getComponentValue(components.ArmyConfig, entityIndex);
            const myArtilleryColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { myArtilleryPosition, myArtilleryConfig, myArtilleryColor };
        });

        setMyArtillery(artillery)
    }, [armyEntities, valuePos, valueCfg, valueCol]);

    return myArtillery;
}