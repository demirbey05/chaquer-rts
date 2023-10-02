import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../context/MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyFleetPositions(address: any) {
    const { components } = useMUD();

    const fleetEntity = useEntityQuery([HasValue(components.FleetOwnable, { owner: address, gameID: BigInt(1) })]);
    const valuePos = useObservableValue(components.Position.update$);
    const valueCfg = useObservableValue(components.FleetConfig.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    const [fleet, setFleet] = useState<any[]>();

    useEffect(() => {
        const fleets = fleetEntity.map((entityIndex) => {
            const myFleetPosition = getComponentValue(components.Position, entityIndex);
            const myFleetConfig = getComponentValue(components.FleetConfig, entityIndex);
            const myFleetColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { myFleetPosition, myFleetConfig, myFleetColor }
        })
        setFleet(fleets);
    }, [fleetEntity, valuePos, valueCfg, valueCol]);

    return fleet;
}