import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyResourcePositions(address: any) {
    const { components } = useMUD();

    const resourceEntity = useEntityQuery([HasValue(components.ResourceOwnable, { owner: address })]);

    const [resources, setResources] = useState<any>();
    const value = useObservableValue(components.ResourceOwnable.update$);

    useEffect(() => {
        const resource = resourceEntity.map((entityIndex) => {
            const myResourcePosition = getComponentValue(components.Position, entityIndex);
            const myResourceColor = getComponentValue(components.Position, entityIndex);
            return { myResourcePosition, myResourceColor };
        })
        setResources(resource);
    }, [resourceEntity, value]);

    return resources;
}
