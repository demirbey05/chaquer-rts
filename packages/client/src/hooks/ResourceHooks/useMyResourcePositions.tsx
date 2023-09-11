import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyResourcePositions(address: any) {
    const { components } = useMUD();

    const resourceEntity = useEntityQuery([HasValue(components.ResourceOwnable, { owner: address })]);

    const [resourcePosition, setResourcePosition] = useState<any>();
    const value = useObservableValue(components.ResourceOwnable.update$);

    useEffect(() => {
        const resourcePosition = resourceEntity.map((entityIndex) => {
            return getComponentValue(components.Position, entityIndex);
        })
        setResourcePosition(resourcePosition);
    }, [resourceEntity, value]);

    return resourcePosition;
}
