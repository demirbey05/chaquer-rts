export const DockSettleEvent = (
    setIsMineStage: (value: boolean) => void,
    setIsAttackStage: (value: boolean) => void,
    setIsArmyMoveStage: (value: boolean) => void,
    setDockCaptureStage: (value: boolean) => void,
    setFromArmyPosition: any,
    setArmyPositionToSettleDock: any,
    fromArmyPositionRef: any,
    setDockPosition: any,
    toArmyPositionRef: any,
) => {
    setIsMineStage(false)
    setIsAttackStage(false)
    setDockCaptureStage(false)
    setFromArmyPosition(undefined)
    setArmyPositionToSettleDock(fromArmyPositionRef.current)
    setDockPosition(toArmyPositionRef.current)
    toArmyPositionRef.current = { x: -1, y: -1 };
    fromArmyPositionRef.current = { x: "-1", y: "-1" };
}