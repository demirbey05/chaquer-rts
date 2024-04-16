import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const CastleAttackEvent = (
    setArtilleryCaptureStage: (value: boolean) => void,
    setIsFleetLoadStage: (value: boolean) => void,
    setIsArmyMergeStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setAttackFromArmyPositionToCastle: any,
    setAttackToArmyPositionToCastle: any,
    fromArmyPositionRef: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]) => {
    setArtilleryCaptureStage(false)
    setIsFleetLoadStage(false)
    setIsArmyMoveStage(false)
    setIsMineStage(false)
    setDockSettleStage(false)
    setDockCaptureStage(false)
    setIsArmyMergeStage(false)
    setFromArmyPosition(undefined);
    setAttackFromArmyPositionToCastle(fromArmyPositionRef.current);
    setAttackToArmyPositionToCastle(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}