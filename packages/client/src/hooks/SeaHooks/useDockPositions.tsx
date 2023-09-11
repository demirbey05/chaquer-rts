import { useMUD } from "../../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useDockPositions() {
    const { components } = useMUD();

    const dockEntites = useEntityQuery([Has(components.DockOwnable)]);
    const value = useObservableValue(components.DockOwnable.update$);

    const [docks, setDocks] = useState<any[]>([]);
    useEffect(() => {
        const dock = dockEntites.map((entityIndex) => {
            const dockPosition = getComponentValue(components.Position, entityIndex)
            const dockColor = getComponentValue(components.ColorOwnable, entityIndex)

            return { dockPosition, dockColor }
        });

        setDocks(dock);
    }, [dockEntites, value]);

    return docks;
}
