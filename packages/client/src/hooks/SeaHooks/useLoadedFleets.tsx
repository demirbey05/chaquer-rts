import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { HasValue } from "@latticexyz/recs";
import { useState, useEffect, useRef } from "react";
import { getFleetIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getFleetIDFromPosition";

export function useLoadedFleets(gameID: number, fleetPosition: any) {
    const { components } = useMUD();
    const fleetID = useRef<any>(["0", "0"])

    if (fleetPosition) {
        fleetID.current = getFleetIDFromPosition(
            fleetPosition,
            components.Position,
            components.FleetOwnable,
            gameID
        );
    } else {
        fleetID.current = ["0", "0"]
    }

    const fleetEntites = useEntityQuery([
        HasValue(components.FleetCarry, { gameID: BigInt(gameID), carrierID: fleetID.current.values().next().value }),
    ]);

    const update = useObservableValue(components.FleetCarry.update$);

    const [isLoadedFleet, setIsLoadedFleet] = useState<boolean>(false);
    useEffect(() => {
        if (fleetEntites && fleetEntites.length > 0) {
            setIsLoadedFleet(true)
        } else {
            setIsLoadedFleet(false)
        }
    }, [fleetEntites, update, fleetID.current]);

    return isLoadedFleet;
}