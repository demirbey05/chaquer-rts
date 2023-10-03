import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useFleetPositions(gameID: number) {
    const { components } = useMUD();

    const fleetEntites = useEntityQuery([
        HasValue(components.FleetOwnable, { gameID: BigInt(gameID) }),
    ]);
    const valuePos = useObservableValue(components.Position.update$);
    const valueCfg = useObservableValue(components.FleetConfig.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    const [fleet, setFleet] = useState<any[]>([]);
    useEffect(() => {
        const fleets = fleetEntites.map((entityIndex) => {
            const fleetPosition = getComponentValue(components.Position, entityIndex);
            const fleetConfig = getComponentValue(components.FleetConfig, entityIndex);
            const fleetColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { fleetPosition, fleetConfig, fleetColor }
        });
        setFleet(fleets);
    }, [fleetEntites, valuePos, valueCfg, valueCol]);

    return fleet;
}