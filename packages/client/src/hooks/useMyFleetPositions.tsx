import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyFleetPositions(address: any) {
    const { components } = useMUD();

    const fleetEntity = useEntityQuery([HasValue(components.FleetOwnable, { owner: address })]);

    const [fleetPositions, setFleetPositions] = useState<any[]>();
    const value = useObservableValue(components.FleetOwnable.update$);

    useEffect(() => {
        const positions = fleetEntity.map((entityIndex) => {
            return getComponentValue(components.Position, entityIndex);
        })
        setFleetPositions(positions);
    }, [fleetEntity, value]);

    return fleetPositions;
}
