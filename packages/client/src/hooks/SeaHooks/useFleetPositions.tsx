import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useFleetPositions() {
    const { components } = useMUD();

    const fleetEntites = useEntityQuery([Has(components.FleetOwnable)]);
    const value = useObservableValue(components.Position.update$);

    const [fleet, setFleet] = useState<any[]>([]);
    useEffect(() => {
        const fleets = fleetEntites.map((entityIndex) => {
            const fleetPosition = getComponentValue(components.Position, entityIndex);
            const fleetConfig = getComponentValue(components.FleetConfig, entityIndex);
            const fleetColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { fleetPosition, fleetConfig, fleetColor }
        });
        setFleet(fleets);
    }, [fleetEntites, value]);

    return fleet;
}
