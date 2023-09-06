import { useEffect } from "react"
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyResource } from "../../../utils/helperFunctions/ResourceFuntions/isMyResource";

export const ResourceEffects = (myResourcePositions: any[], resources: any[], isMineStage: boolean | undefined, fromArmyPosition: { x: any, y: any } | undefined) => {
    // Deploy resource emojis
    useEffect(() => {
        if (myResourcePositions) {
            myResourcePositions.map((position: any) => {
                document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
            })
        }

        if (resources) {
            resources.map(data => {
                if (data.resource.sourceType === 0) {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🌽";
                }
                else if (data.resource.sourceType === 1) {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🪓";
                }
                else {
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "⛏️";
                }
            })
        }

        return () => {
            if (myResourcePositions) {
                myResourcePositions.map((position: any) => {
                    if (document.getElementById(`${position.y},${position.x}`)) {
                        document.getElementById(`${position.y},${position.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
                    }
                });
            }
        };
    }, [myResourcePositions])

    // Handle Mine Capture OffCanvas
    useEffect(() => {
        resources.map((data: any) => {
            if (isMineStage && fromArmyPosition) {
                isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "#mineCaptureDrawer");
            }
        });

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
    }, [isMineStage])
}