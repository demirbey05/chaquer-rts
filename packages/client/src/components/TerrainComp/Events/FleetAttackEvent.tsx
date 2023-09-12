import { getEnemyFleetConfigByPosition, getMyFleetConfigByPosition } from "../../../utils/helperFunctions/SeaFunctions/getFleetConfigByPosition";

export const FleetAttackEvent = (
    setIsFleetMoveStage: (value: boolean) => void,
    setSeaMineStage: (value: boolean) => void,
    setFromFleetPosition: any,
    setAttackerFleetPosition: any,
    setTargetFleetPosition: any,
    fromFleetPositionRef: any,
    toFleetPositionRef: any,
    setMyFleetConfig: any,
    setEnemyFleetConfig: any,
    myFleetPositions: any[],
    fleetPositions: any
) => {
    setIsFleetMoveStage(false);
    setSeaMineStage(false)
    setFromFleetPosition(undefined);
    setAttackerFleetPosition(fromFleetPositionRef.current);
    setTargetFleetPosition(toFleetPositionRef.current);
    setMyFleetConfig(
        getMyFleetConfigByPosition({ x: fromFleetPositionRef.current.x, y: fromFleetPositionRef.current.y, }, myFleetPositions)
    );
    setEnemyFleetConfig(
        getEnemyFleetConfigByPosition(
            { x: toFleetPositionRef.current.x, y: toFleetPositionRef.current.y }, fleetPositions)
    );
    toFleetPositionRef.current = { x: -1, y: -1 };
    fromFleetPositionRef.current = { x: "-1", y: "-1" };
}