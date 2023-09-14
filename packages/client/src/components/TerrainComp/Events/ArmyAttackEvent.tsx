import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";
import { getEnemyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";

export const ArmyAttackEvent = (
    setIsArmyMoveStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setAttackFromArmyPositionToArmy: any,
    setAttackToArmyPositionToArmy: any,
    fromArmyPositionRef: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    setEnemyArmyConfig: any,
    myArmyPosition: any[],
    armyPositions: any
) => {
    setIsArmyMoveStage(false);
    setIsMineStage(false)
    setDockSettleStage(false);
    setDockCaptureStage(false)
    setFromArmyPosition(undefined);
    setAttackFromArmyPositionToArmy(fromArmyPositionRef.current);
    setAttackToArmyPositionToArmy(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    setEnemyArmyConfig(
        getEnemyArmyConfigByPosition(
            { x: toArmyPositionRef.current.x, y: toArmyPositionRef.current.y }, armyPositions)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}