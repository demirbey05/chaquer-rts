import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const MineCaptureEvent = (
    setIsArmyMoveStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setAttackFromArmyPositionToMine: any,
    fromArmyPositionRef: any,
    setTargetMinePosition: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]
) => {
    setIsArmyMoveStage(false)
    setIsAttackStage(false)
    setDockSettleStage(false)
    setFromArmyPosition(undefined);
    setAttackFromArmyPositionToMine(fromArmyPositionRef.current);
    setTargetMinePosition(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}