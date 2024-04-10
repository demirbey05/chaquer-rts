import { getMyArmyConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition"

export const ArtilleryCaptureEvent = (
    setIsFleetLoadStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setIsDockCapture: (value: boolean) => void,
    setFromArmyPosition: any,
    setArtilleryAttackerArmyPosition: any,
    fromArmyPositionRef: any,
    setTargetArtilleryPosition: any,
    toArmyPositionRef: any,
    setMyArmyConfig: any,
    myArmyPosition: any[]
) => {
    setIsFleetLoadStage(false)
    setIsArmyMoveStage(false)
    setIsMineStage(false);
    setIsAttackStage(false)
    setDockSettleStage(false)
    setIsDockCapture(false)
    setFromArmyPosition(undefined);

    setArtilleryAttackerArmyPosition(fromArmyPositionRef.current);
    setTargetArtilleryPosition(toArmyPositionRef.current);
    setMyArmyConfig(
        getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
    );
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}