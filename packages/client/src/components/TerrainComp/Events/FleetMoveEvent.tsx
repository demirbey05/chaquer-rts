import { findIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const FleetMoveEvent = async (
    setIsFleetMoveStage: (value: boolean) => void,
    setSeaMineStage: (value: boolean) => void,
    setIsFleetAttackStage: (value: boolean) => void,
    fromFleetPositionRef: any,
    toFleetPositionRef: any,
    isFleetMoveStage: boolean,
    fromFleetPosition: any,
    setFromFleetPosition: any,
    components: any,
    movingFleetID: any,
    systemCalls: any,
    setErrorMessage: any,
    setErrorTitle: any,
    setShowError: any,
    setIsLoading: (value: boolean) => void
) => {
    setSeaMineStage(false)
    setIsFleetAttackStage(false)

    const _fleetID = findIDFromPosition(
        fromFleetPositionRef.current,
        components.Position
    );

    if (_fleetID !== null) {
        movingFleetID.current = [..._fleetID][0];
    }

    setIsFleetMoveStage(false);

    if (toFleetPositionRef.current && isFleetMoveStage) {
        setIsLoading(true)
        var targetDiv = document.getElementById(`${toFleetPositionRef.current.y},${toFleetPositionRef.current.x}`);
        targetDiv?.classList.add("animate-border-fleet-move");

        const tx = await systemCalls.moveFleet(
            movingFleetID.current,
            toFleetPositionRef.current.x,
            toFleetPositionRef.current.y
        )
        if (tx == null) {
            setErrorMessage("An error occurred while trying to move the fleet.")
            setErrorTitle("Fleet Move Error")
            setShowError(true)
            setIsLoading(false)
            targetDiv?.classList.remove("animate-border-fleet-move");
        }

        document.getElementById(`${fromFleetPosition.y},${fromFleetPosition.x}`)!.innerHTML = "";
        document.getElementById(`${fromFleetPosition.y},${fromFleetPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
        targetDiv?.classList.remove("animate-border-fleet-move");

        setFromFleetPosition(undefined);
        toFleetPositionRef.current = { x: -1, y: -1 };
        fromFleetPositionRef.current = { x: "-1", y: "-1" };
        setIsLoading(false)
    }
}