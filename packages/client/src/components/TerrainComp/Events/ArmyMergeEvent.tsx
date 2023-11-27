export const ArmyMergeEvent = (
    setIsFleetLoadStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setIsMineStage: (value: boolean) => void,
    setDockSettleStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setMergeTargetArmyPosition: any,
    setMergeFromArmyPosition: any,
    fromArmyPositionRef: any,
    toArmyPositionRef: any,
) => {
    setIsFleetLoadStage(false)
    setIsAttackStage(false)
    setIsArmyMoveStage(false);
    setIsMineStage(false)
    setDockSettleStage(false);
    setDockCaptureStage(false)
    setFromArmyPosition(undefined);
    setMergeFromArmyPosition(fromArmyPositionRef.current);
    setMergeTargetArmyPosition(toArmyPositionRef.current);
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}