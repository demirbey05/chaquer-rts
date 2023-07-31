import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useResources() {
    const { components } = useMUD();

    // Get Castle entities
    const resourceEntites = useEntityQuery([Has(components.ResourceOwnable)]);
    const value = useObservableValue(components.ResourceOwnable.update$);

    // Transform castle positions and store in separate state
    const [resources, setResources] = useState<any[]>([]);

    useEffect(() => {
        const positions = resourceEntites.map((entityIndex) =>
            getComponentValue(components.Position, entityIndex)
        );

        const resource = resourceEntites.map((entityIndex) =>
            getComponentValue(components.ResourceOwnable, entityIndex)
        );

        // Combine positions and resource arrays into an array of objects
        const combinedData = positions.map((pos, index) => ({
            positions: pos,
            resource: resource[index],
        }));

        setResources(combinedData);
    }, [resourceEntites, value]);

    // Return transformed castle positions
    return resources;
}
