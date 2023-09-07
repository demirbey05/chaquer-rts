import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useFleetPositions() {
    const { components } = useMUD();

    const fleetEntites = useEntityQuery([Has(components.FleetOwnable)]);
    const value = useObservableValue(components.FleetOwnable.update$);

    const [fleetPositions, setFleetPositions] = useState<any[]>([]);
    useEffect(() => {
        const positions = fleetEntites.map((entityIndex) =>
            getComponentValue(components.Position, entityIndex)
        );
        setFleetPositions(positions);
    }, [fleetEntites, value]);

    return fleetPositions;
}
