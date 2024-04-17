import { getMyArtilleryConfigByPosition } from "../../../utils/helperFunctions/ArmyFunctions/getArtilleryConfigByPosition";

export const ArtilleryAttackEvent = (
    setIsArtilleryMoveStage: (value: boolean) => void,
    setAttackFromArtilleryPositionToCastle: any,
    setAttackToArtilleryPositionToCastle: any,
    fromArtilleryPositionRef: any,
    toArtilleryPositionRef: any,
    setMyArtilleryConfig: any,
    myArtilleryPositions: any[]) => {
    setIsArtilleryMoveStage(false)
    setAttackFromArtilleryPositionToCastle(fromArtilleryPositionRef.current);
    setAttackToArtilleryPositionToCastle(toArtilleryPositionRef.current);
    setMyArtilleryConfig(
        getMyArtilleryConfigByPosition({ x: fromArtilleryPositionRef.current.x, y: fromArtilleryPositionRef.current.y, }, myArtilleryPositions).myArtilleryConfig.numArtillery
    );
    toArtilleryPositionRef.current = { x: -1, y: -1 };
    fromArtilleryPositionRef.current = { x: "-1", y: "-1" };
}