import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useDockPositions() {
    const { components } = useMUD();

    const dockEntites = useEntityQuery([Has(components.DockOwnable)]);
    const valueOwn = useObservableValue(components.DockOwnable.update$);
    const valueCol = useObservableValue(components.ColorOwnable.update$);

    const [docks, setDocks] = useState<any[]>([]);
    useEffect(() => {
        const dock = dockEntites.map((entityIndex) => {
            const dockPosition = getComponentValue(components.Position, entityIndex)
            const dockColor = getComponentValue(components.ColorOwnable, entityIndex)

            return { dockPosition, dockColor }
        });

        setDocks(dock);
    }, [dockEntites, valueOwn, valueCol]);

    return docks;
}