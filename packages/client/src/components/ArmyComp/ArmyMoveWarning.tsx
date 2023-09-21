import { useArmy } from "../../context/ArmyContext"

export const ArmyMoveWarning = () => {
    const { isArmyMoveStage } = useArmy();

    if (isArmyMoveStage) {
        return (
            <div className="warning-on-bottom">
                <h2>
                    Click blue tiles to move your army
                </h2>
            </div>
        )
    } else {
        return null;
    }
}