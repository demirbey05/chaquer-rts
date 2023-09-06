import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyDockPositions(address: any) {
    const { components } = useMUD();

    const dockEntity = useEntityQuery([HasValue(components.DockOwnable, { owner: address })]);

    const [dockPositions, setDockPositions] = useState<any[]>();
    const value = useObservableValue(components.DockOwnable.update$);

    useEffect(() => {
        const dockPosition = dockEntity.map((entityIndex) => {
            return getComponentValue(components.Position, entityIndex);
        })
        setDockPositions(dockPosition);
    }, [dockEntity, value]);

    return dockPositions;
}
