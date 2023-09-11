import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyFleetPositions(address: any) {
    const { components } = useMUD();

    const fleetEntity = useEntityQuery([HasValue(components.FleetOwnable, { owner: address })]);

    const [fleet, setFleet] = useState<any[]>();
    const value = useObservableValue(components.Position.update$);

    useEffect(() => {
        const fleets = fleetEntity.map((entityIndex) => {
            const myFleetPosition = getComponentValue(components.Position, entityIndex);
            const myFleetConfig = getComponentValue(components.FleetConfig, entityIndex);
            return { myFleetPosition, myFleetConfig }
        })
        setFleet(fleets);
    }, [fleetEntity, value]);

    return fleet;
}
