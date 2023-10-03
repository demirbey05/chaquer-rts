import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../context/MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyResourcePositions(address: any, gameID: number) {
    const { components } = useMUD();

    const resourceEntity = useEntityQuery([
        HasValue(components.ResourceOwnable, { gameID: BigInt(gameID), owner: address }),
    ]);

    const [resources, setResources] = useState<any>();
    const valueOwn = useObservableValue(components.ResourceOwnable.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    useEffect(() => {
        const resource = resourceEntity.map((entityIndex) => {
            const myResourcePosition = getComponentValue(components.Position, entityIndex);
            const myResourceColor = getComponentValue(components.ColorOwnable, entityIndex);
            return { myResourcePosition, myResourceColor };
        })
        setResources(resource);
    }, [resourceEntity, valueOwn, valueCol]);

    return resources;
}