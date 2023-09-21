import { useArmy } from "../../context/ArmyContext";

export const ArmyUpdateWarning = () => {
    const { isArmyUpdateStage } = useArmy();

    if (isArmyUpdateStage) {
        return (
            <div className='warning-on-top' style={{ marginTop: "175px" }}>
                <h2>
                    Click orange-army tiles to update army
                </h2>
            </div>
        );
    } else {
        return null;
    }
}
