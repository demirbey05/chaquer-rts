import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { useMUD } from "../../context/MUDContext";
import { HasValue, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useMyDockPositions(address: any) {
    const { components } = useMUD();

    const dockEntity = useEntityQuery([HasValue(components.DockOwnable, { owner: address })]);

    const [docks, setDocks] = useState<any[]>();
    const value = useObservableValue(components.DockOwnable.update$);

    useEffect(() => {
        const dockPosition = dockEntity.map((entityIndex) => {
            const myDockPosition = getComponentValue(components.Position, entityIndex);
            const myDockColor = getComponentValue(components.ColorOwnable, entityIndex);

            return { myDockPosition, myDockColor }
        })
        setDocks(dockPosition);
    }, [dockEntity, value]);

    return docks;
}
