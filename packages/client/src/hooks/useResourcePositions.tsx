import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useResourcePositions() {
    const { components } = useMUD();

    // Get Castle entities
    const resourceEntites = useEntityQuery([Has(components.ResourceOwnable)]);
    const value = useObservableValue(components.ResourceOwnable.update$);

    // Transform castle positions and store in separate state
    const [resourcePositions, setResourcePositions] = useState<any[]>([]);
    useEffect(() => {
        const positions = resourceEntites.map((entityIndex) =>
            getComponentValue(components.Position, entityIndex)
        );
        setResourcePositions(positions);
    }, [resourceEntites, value]);

    // Return transformed castle positions
    return resourcePositions;
}
