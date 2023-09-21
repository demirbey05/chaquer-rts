import { useFleet } from "../../context/FleetContext"

export const FleetMoveWarning = () => {
    const { isFleetMoveStage } = useFleet();

    if (isFleetMoveStage) {
        return (
            <div className="warning-on-bottom">
                <h2>
                    Click yellow tiles to move your fleet
                </h2>
            </div>
        )
    } else {
        return null;
    }
}