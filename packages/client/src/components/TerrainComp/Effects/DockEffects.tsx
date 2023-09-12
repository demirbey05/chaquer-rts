import { useEffect } from "react"
import { isPositionNextToSea } from "../../../utils/helperFunctions/SeaFunctions/isPositionNextToSea";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isResourcePosition } from "../../../utils/helperFunctions/ResourceFuntions/isResourcePosition";
import { isCastlePosition } from "../../../utils/helperFunctions/CastleFunctions/isCastlePosition";
import { isMyDock } from "../../../utils/helperFunctions/SeaFunctions/isMyDock";
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { colorPath } from "../../../utils/constants/constants";
import { isArmyPosition } from "../../../utils/helperFunctions/ArmyFunctions/isArmyPosition";

export const DockEffects = (castlePositions: any[], resources: any[], myArmyPosition: any[], armyPositions: any[], dockPositions: any[], myDockPositions: any[] | undefined, values: number[][], dockSettleStage: boolean, dockCaptureStage: boolean, rows: number[], columns: number[], fromArmyPosition: any) => {
    /* Deploy dock emojis */
    useEffect(() => {
        if (dockPositions && dockPositions.length > 0) {
            dockPositions.map(
                (data) => {
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.innerHTML = "⚓";
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.border = "4px solid";
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.borderColor = colorPath[Number(data.dockColor.colorIndex)];
                }
            );
        }
    }, [dockPositions])

    /* Check my dock positions and add borders */
    useEffect(() => {
        if (myDockPositions && myDockPositions.length > 0) {
            myDockPositions.map((position: any) => {
                document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)!.style.border = "4px solid";
                document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)!.style.borderColor = colorPath[Number(position.myDockColor.colorIndex)];
            });
        }

        return () => {
            if (myDockPositions && myDockPositions.length > 0) {
                myDockPositions.map((position: any) => {
                    if (document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)) {
                        document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
                    }
                });
            }
        }
    }, [myDockPositions])

    /* Assign data-bs-toggle ve data-bs-target attributes to possible dock positions */
    useEffect(() => {
        if (values && dockSettleStage && fromArmyPosition) {
            rows.forEach((row) => {
                columns.forEach((column) => {
                    const element = document.getElementById(`${column},${row}`);
                    if (element && isPositionNextToSea(row, column, values) && isManhattanPosition({ x: row, y: column }, fromArmyPosition.x, fromArmyPosition.y)) {
                        const position = { x: row, y: column };
                        const isPositionOccupied = isArmyPosition(position.x, position.y, armyPositions) ||
                            isResourcePosition(position.x, position.y, resources) ||
                            isCastlePosition(position.x, position.y, castlePositions) ||
                            isMyDock(position.x, position.y, myDockPositions)

                        if (!isPositionOccupied) {
                            element.setAttribute("data-bs-toggle", "modal");
                            element.setAttribute("data-bs-target", "#dockSettleModal");
                        }
                    }
                });
            });
        }

        return () => {
            if (values) {
                rows.forEach((row) => {
                    columns.forEach((column) => {
                        const element = document.getElementById(`${column},${row}`);
                        if (element && isPositionNextToSea(row, column, values)) {
                            element.setAttribute("data-bs-toggle", "");
                            element.setAttribute("data-bs-target", "");
                        }
                    });
                });
            }
        }
    }, [values, rows, columns, armyPositions, resources, castlePositions, dockSettleStage, myArmyPosition, fromArmyPosition]);

    // Handle Dock Capture OffCanvas
    useEffect(() => {
        if (dockPositions && dockCaptureStage && fromArmyPosition && myDockPositions) {
            dockPositions.map((data: any) => {
                isManhattanPosition(data.dockPosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyDock(data.dockPosition.x, data.dockPosition.y, myDockPositions) &&
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.dockPosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyDock(data.dockPosition.x, data.dockPosition.y, myDockPositions) &&
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-target", "#dockCaptureDrawer");
            });
        }

        return () => {
            if (dockPositions) {
                dockPositions.map((data: any) => {
                    if (document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`) !== null) {
                        document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-target", "");
                    }
                });
            }
        }
    }, [dockPositions, myDockPositions, dockCaptureStage, fromArmyPosition])
}