import { getMyFleetConfigByPosition } from "../../../utils/helperFunctions/SeaFunctions/getFleetConfigByPosition"

export const SeaMineCaptureEvent = (
    setIsFleetMoveStage: (value: boolean) => void,
    setIsFleetUnloadStage: (value: boolean) => void,
    setFleetSettleStage: (value: boolean) => void,
    setIsFleetAttackStage: (value: boolean) => void,
    setFromFleetPosition: any,
    setSeaMineAttackerFleetPosition: any,
    fromFleetPositionRef: any,
    setTargetSeaMinePosition: any,
    toFleetPositionRef: any,
    setMyFleetConfig: any,
    myFleetPosition: any[] | undefined
) => {
    setIsFleetMoveStage(false)
    setFleetSettleStage(false)
    setIsFleetAttackStage(false)
    setIsFleetUnloadStage(false)
    setFromFleetPosition(undefined);
    setSeaMineAttackerFleetPosition(fromFleetPositionRef.current);
    setTargetSeaMinePosition(toFleetPositionRef.current);
    setMyFleetConfig(
        getMyFleetConfigByPosition({ x: fromFleetPositionRef.current.x, y: fromFleetPositionRef.current.y, }, myFleetPosition)
    );
    toFleetPositionRef.current = { x: -1, y: -1 };
    fromFleetPositionRef.current = { x: "-1", y: "-1" };
}