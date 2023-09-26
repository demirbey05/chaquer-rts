import { useEffect } from "react"
import { colorPath } from "../../../utils/constants/constants";
import { canCastleBeSettle } from "../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyResource } from "../../../utils/helperFunctions/ResourceFuntions/isMyResource";

export const ResourceEffects = (values: number[][],
    fromFleetPosition: any,
    seaMineStage: boolean,
    myResourcePositions: any[],
    resources: any[],
    isMineStage: boolean | undefined,
    fromArmyPosition: { x: any, y: any } | undefined
) => {
    // Deploy resource emojis
    useEffect(() => {
        if (myResourcePositions) {
            myResourcePositions.map((position: any) => {
                document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.border = "2px solid";
                document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.borderColor = colorPath[Number(position.myResourceColor.colorIndex)];
            })
        }

        if (resources) {
            resources.map(data => {
                if (data.resource.sourceType === 0) {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🌽";
                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = colorPath[data.color.colorIndex];
                    }
                }
                else if (data.resource.sourceType === 1) {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🪓";
                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = colorPath[data.color.colorIndex];
                    }
                }
                else {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "⛏️";
                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = colorPath[data.color.colorIndex];
                    }
                }
            })
        }

        return () => {
            if (myResourcePositions) {
                myResourcePositions.map((position: any) => {
                    if (document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)) {
                        document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
                    }
                });
            }

            if (resources) {
                resources.map((position: any) => {
                    if (document.getElementById(`${position.positions.y},${position.positions.x}`)) {
                        document.getElementById(`${position.positions.y},${position.positions.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
                    }
                });
            }
        };
    }, [myResourcePositions, resources])

    // Handle Mine Capture OffCanvas
    useEffect(() => {
        if (isMineStage && fromArmyPosition) {
            resources.map((data: any) => {
                isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    canCastleBeSettle(values[data.positions.x][data.positions.y]) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    canCastleBeSettle(values[data.positions.x][data.positions.y]) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "#mineCaptureDrawer");
            });
        }

        return () => {
            if (resources) {
                resources.map((data: any) => {
                    if (document.getElementById(`${data.positions.y},${data.positions.x}`) !== null) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
                    }
                });
            }
        }
    }, [isMineStage, fromArmyPosition, myResourcePositions, resources, values])

    // Handle Sea Mine Capture OffCanvas
    useEffect(() => {
        if (resources && seaMineStage && fromFleetPosition) {
            resources.map((data: any) => {
                isManhattanPosition(data.positions, fromFleetPosition.x, fromFleetPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.positions, fromFleetPosition.x, fromFleetPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "#seaMineCaptureDrawer");
            });
        }

        return () => {
            if (resources) {
                resources.map((data: any) => {
                    if (document.getElementById(`${data.positions.y},${data.positions.x}`) !== null) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
                    }
                });
            }
        }
    }, [seaMineStage, fromFleetPosition, resources, myResourcePositions])
}