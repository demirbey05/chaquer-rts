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

        try {
            const tx = await systemCalls.moveFleet(
                movingFleetID.current,
                toFleetPositionRef.current.x,
                toFleetPositionRef.current.y
            )

            if (tx) {
                document.getElementById(`${fromFleetPosition.y},${fromFleetPosition.x}`)!.innerHTML = "";
                document.getElementById(`${fromFleetPosition.y},${fromFleetPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
            } else {
                setErrorMessage("You need 50 food + 50 gold to move your fleet.")
                setErrorTitle("Fleet Move Error")
                setShowError(true)
            }

            setFromFleetPosition(undefined);
            toFleetPositionRef.current = { x: -1, y: -1 };
            fromFleetPositionRef.current = { x: "-1", y: "-1" };
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            targetDiv?.classList.remove("animate-border-fleet-move");
        }
    }
}