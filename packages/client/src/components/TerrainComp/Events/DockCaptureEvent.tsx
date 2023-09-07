import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const DockCaptureEvent = (
    setIsArmyMoveStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setDockAttackerArmyPosition: any,
    fromArmyPositionRef: any,
    setTargetDockPosition: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]
) => {
    setIsArmyMoveStage(false)
    setIsAttackStage(false)
    setDockSettleStage(false)
    setFromArmyPosition(undefined);
    setDockAttackerArmyPosition(fromArmyPositionRef.current);
    setTargetDockPosition(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}