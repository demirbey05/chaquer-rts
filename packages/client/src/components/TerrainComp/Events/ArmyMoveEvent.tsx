import { findIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const ArmyMoveEvent = async (
    setIsAttackStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    fromArmyPositionRef: any,
    setIsArmyMoveStage: (value: boolean) => void,
    toArmyPositionRef: any,
    isArmyMoveStage: boolean | undefined,
    fromArmyPosition: any,
    setFromArmyPosition: any,
    components: any,
    movingArmyId: any,
    systemCalls: any,
    setErrorMessage: any,
    setErrorTitle: any,
    setShowError: any
) => {
    setIsAttackStage(false)
    setIsMineStage(false)
    setDockSettleStage(false);
    setDockCaptureStage(false)

    const movingArmyIdMap = findIDFromPosition(
        fromArmyPositionRef.current,
        components.Position
    );

    if (movingArmyIdMap !== null) {
        movingArmyId.current = [...movingArmyIdMap][0];
    }

    setIsArmyMoveStage(false);

    if (toArmyPositionRef.current && isArmyMoveStage) {
        const tx = await systemCalls.moveArmy(
            movingArmyId.current,
            toArmyPositionRef.current.x,
            toArmyPositionRef.current.y,
            1
        )
        if (tx == null) {
            setErrorMessage("An error occurred while trying to move army.")
            setErrorTitle("Army Move Error")
            setShowError(true)
            return
        }

        document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.innerHTML = "";
        document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";

        setFromArmyPosition(undefined);
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
    }
}