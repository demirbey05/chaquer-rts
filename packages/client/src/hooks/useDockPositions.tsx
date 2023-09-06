import { useMUD } from "../MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useDockPositions() {
    const { components } = useMUD();

    const dockEntites = useEntityQuery([Has(components.DockOwnable)]);
    const value = useObservableValue(components.DockOwnable.update$);

    const [dockPositions, setDuckPositions] = useState<any[]>([]);
    useEffect(() => {
        const positions = dockEntites.map((entityIndex) =>
            getComponentValue(components.Position, entityIndex)
        );
        setDuckPositions(positions);
    }, [dockEntites, value]);

    return dockPositions;
}
