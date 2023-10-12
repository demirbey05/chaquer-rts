import { getIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/getIDFromPosition";

export const ArmyMoveEvent = async (
    setIsArmyMergeStage: (value: boolean) => void,
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
    setShowError: any,
    setIsLoading: (value: boolean) => void,
    gameID: number
) => {
    setIsArmyMoveStage(false);
    setIsAttackStage(false);
    setIsMineStage(false);
    setDockSettleStage(false);
    setDockCaptureStage(false);
    setIsArmyMergeStage(false)

    const movingArmyIdMap = getIDFromPosition(
        fromArmyPositionRef.current,
        components.Position,
        gameID
    );

    if (movingArmyIdMap !== null) {
        movingArmyId.current = [...movingArmyIdMap][0];
    }

    if (toArmyPositionRef.current && isArmyMoveStage) {
        setIsLoading(true);
        var targetDiv = document.getElementById(`${toArmyPositionRef.current.y},${toArmyPositionRef.current.x}`);
        targetDiv?.classList.add("animate-border-army-move");

        const tx = await systemCalls.moveArmy(
            movingArmyId.current,
            toArmyPositionRef.current.x,
            toArmyPositionRef.current.y,
            gameID
        );

        if (tx) {
            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.innerHTML = "";
            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";

            setFromArmyPosition(undefined);
            toArmyPositionRef.current = { x: -1, y: -1 };
            fromArmyPositionRef.current = { x: "-1", y: "-1" };
        } else {
            setErrorMessage("You need 30 food + 30 gold to move your army.");
            setErrorTitle("Army Move Error");
            setShowError(true);
        }

        setIsLoading(false);
        targetDiv?.classList.remove("animate-border-army-move");
    }
};