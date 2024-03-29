import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const MineCaptureEvent = (
    setIsFleetLoadStage: (value: boolean) => void,
    setIsArmyMergeStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setAttackerArmyPosition: any,
    fromArmyPositionRef: any,
    setTargetMinePosition: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]
) => {
    setIsFleetLoadStage(false)
    setIsArmyMoveStage(false)
    setIsAttackStage(false)
    setDockSettleStage(false)
    setDockCaptureStage(false)
    setIsArmyMergeStage(false)
    setFromArmyPosition(undefined);
    setAttackerArmyPosition(fromArmyPositionRef.current);
    setTargetMinePosition(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}