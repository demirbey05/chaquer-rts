import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const CastleAttackEvent = (
    setIsArmyMoveStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setAttackFromArmyPositionToCastle: any,
    setAttackToArmyPositionToCastle: any,
    fromArmyPositionRef: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]) => {
    setIsArmyMoveStage(false)
    setIsMineStage(false)
    setDockSettleStage(false)
    setFromArmyPosition(undefined);
    setAttackFromArmyPositionToCastle(fromArmyPositionRef.current);
    setAttackToArmyPositionToCastle(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}