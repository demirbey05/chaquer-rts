import { useEffect } from "react"
import { isPositionNextToSea } from "../../../utils/helperFunctions/SeaFunctions/isPositionNextToSea";
import { isResourcePosition } from "../../../utils/helperFunctions/ResourceFuntions/isResourcePosition";
import { isCastlePosition } from "../../../utils/helperFunctions/CastleFunctions/isCastlePosition";
import { isMyDock } from "../../../utils/helperFunctions/SeaFunctions/isMyDock";
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { colorPath } from "../../../utils/constants/constants";
import { isArmyPosition } from "../../../utils/helperFunctions/ArmyFunctions/isArmyPosition";
import { getNumberOfSoldierInArmy } from "../../../utils/helperFunctions/ArmyFunctions/getNumberOfSoliderInArmy";

export const DockEffects = (fleetSettleStage: boolean, isArmySettleStage: boolean, castlePositions: any[], resources: any[], myArmyPosition: any[], armyPositions: any[], dockPositions: any[], myDockPositions: any[] | undefined, values: number[][], dockSettleStage: boolean, dockCaptureStage: boolean, rows: number[], columns: number[], fromArmyPosition: any) => {
    /* Deploy dock emojis */
    useEffect(() => {
        if (dockPositions && dockPositions.length > 0) {
            dockPositions.map(
                (data) => {
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.innerHTML = "⚓";
                    if (Number(data.dockColor.colorIndex) !== 0) {
                        document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.border = "4px solid";
                        document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.borderColor = colorPath[Number(data.dockColor.colorIndex)];
                    }

                }
            );
        }
    }, [dockPositions])

    /* Check my dock positions and add borders */
    useEffect(() => {
        if (myDockPositions && myDockPositions.length > 0) {
            myDockPositions.map((position: any) => {
                if (Number(position.myDockColor.colorIndex) !== 0) {
                    document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)!.style.border = "4px solid";
                    document.getElementById(`${position.myDockPosition.y},${position.myDockPosition.x}`)!.style.borderColor = colorPath[Number(position.myDockColor.colorIndex)];
                }
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
                    if (element && isPositionNextToSea(row, column, values) && isManhattanPosition({ x: row, y: column }, fromArmyPosition.x, fromArmyPosition.y) && getNumberOfSoldierInArmy(fromArmyPosition, myArmyPosition) >= 20) {
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
                        if (element && isPositionNextToSea(row, column, values) && !isArmySettleStage) {
                            element.setAttribute("data-bs-toggle", "");
                            element.setAttribute("data-bs-target", "");
                        }
                    });
                });
            }
        }
    }, [values, rows, columns, armyPositions, resources, castlePositions, dockSettleStage, myArmyPosition, fromArmyPosition, isArmySettleStage]);

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

    // Make docks unclickable during castle settlement
    useEffect(() => {
        if (dockPositions && isArmySettleStage) {
            dockPositions.map(
                (data) => {
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.pointerEvents = "none";
                }
            );
        }

        if (dockPositions && !isArmySettleStage) {
            dockPositions.map(
                (data) => {
                    document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.pointerEvents = "auto";
                }
            );
        }
    }, [dockPositions, isArmySettleStage])

    // Make armies unclickable during dock settlement
    useEffect(() => {
        if (armyPositions && fleetSettleStage) {
            armyPositions.map(
                (data) => {
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.style.pointerEvents = "none";
                }
            );
        }

        if (armyPositions && !fleetSettleStage) {
            armyPositions.map(
                (data) => {
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.style.pointerEvents = "auto";
                }
            );
        }
    }, [armyPositions, fleetSettleStage])
}