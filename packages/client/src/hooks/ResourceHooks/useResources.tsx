import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useResources() {
    const { components } = useMUD();

    const resourceEntites = useEntityQuery([Has(components.ResourceOwnable)]);
    const valueOwn = useObservableValue(components.ResourceOwnable.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    const [resources, setResources] = useState<any[]>([]);

    useEffect(() => {
        const positions = resourceEntites.map((entityIndex) =>
            getComponentValue(components.Position, entityIndex)
        );

        const resourceColor = resourceEntites.map((entityIndex) =>
            getComponentValue(components.ColorOwnable, entityIndex)
        );

        const resource = resourceEntites.map((entityIndex) =>
            getComponentValue(components.ResourceOwnable, entityIndex)
        );

        const combinedData = positions.map((pos, index) => ({
            positions: pos,
            resource: resource[index],
            color: resourceColor[index]
        }));

        setResources(combinedData);
    }, [resourceEntites, valueOwn, valueCol]);

    return resources;
}