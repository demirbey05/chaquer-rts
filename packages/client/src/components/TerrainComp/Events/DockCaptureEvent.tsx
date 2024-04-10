import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const DockCaptureEvent = (
    setArtilleryCaptureStage: (value: boolean) => void,
    setIsFleetLoadStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setDockAttackerArmyPosition: any,
    fromArmyPositionRef: any,
    setTargetDockPosition: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]
) => {
    setArtilleryCaptureStage(false)
    setIsFleetLoadStage(false)
    setIsArmyMoveStage(false)
    setIsMineStage(false);
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