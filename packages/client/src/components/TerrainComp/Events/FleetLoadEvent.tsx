export const FleetLoadEvent = (
    setIsArmyMergeStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setLoadArmyPosition: any,
    setTargetLoadFleetPosition: any,
    fromArmyPositionRef: any,
    toArmyPositionRef: any,
) => {
    setIsArmyMergeStage(false);
    setIsAttackStage(false)
    setIsArmyMoveStage(false);
    setIsMineStage(false)
    setDockSettleStage(false);
    setDockCaptureStage(false)
    setFromArmyPosition(undefined);
    setLoadArmyPosition(fromArmyPositionRef.current);
    setTargetLoadFleetPosition(toArmyPositionRef.current);
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}