import { useEffect } from "react"
import { colorPath } from "../../../utils/constants/constants";
import { getManhattanPositions } from "../../../utils/helperFunctions/CustomFunctions/getManhattanPositions";
import { canCastleBeSettle } from "../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { getArmySettlePositions } from "../../../utils/helperFunctions/ArmyFunctions/getArmySettlePositions";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";
import { getArmyMergePositions } from "../../../utils/helperFunctions/ArmyFunctions/getArmyMergePositions";
import { isArmyMergePosition } from "../../../utils/helperFunctions/ArmyFunctions/isArmyMergePositions";

export const ArmyEffects = (isArmyUpdateStage: boolean,
    values: number[][],
    isBorder: boolean,
    myCastlePosition: any[],
    dockPositions: any[],
    castlePositions: any[],
    isArmySettleStage: boolean | undefined,
    armyPositions: any[], myArmyPosition: any[],
    setNumberOfArmy: any,
    myArmyNumber: any,
    resources: any[],
    fleetSettleStage: boolean,
    isArmyMergeStage: boolean,
    fromArmyPosition: any
) => {
    //Makes castle, army and resource positions unClickable to not cause bug during army settlement
    useEffect(() => {
        if (armyPositions && isArmySettleStage) {
            armyPositions.map((data) => {
                if (isEnemyArmy({ x: data.armyPosition.x, y: data.armyPosition.y }, armyPositions, myArmyPosition)) {
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.style.pointerEvents = "none"
                }
            });
        } else if (armyPositions && !isArmySettleStage) {
            armyPositions.map((data) => {
                if (isEnemyArmy({ x: data.armyPosition.x, y: data.armyPosition.y }, armyPositions, myArmyPosition)) {
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.style.pointerEvents = "auto"
                }
            });
        }

        if (resources && isArmySettleStage) {
            resources.map((data) => {
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.pointerEvents = "none"
            });
        } else if (armyPositions && !isArmySettleStage) {
            resources.map((data) => {
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.pointerEvents = "auto"
            });
        }

        if (dockPositions && isArmySettleStage) {
            dockPositions.map((data) => {
                document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.pointerEvents = "none"
            });
        } else if (armyPositions && !isArmySettleStage) {
            dockPositions.map((data) => {
                document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.style.pointerEvents = "auto"
            });
        }
    }, [isArmySettleStage, castlePositions, resources, dockPositions]);

    // Deploy army emojis to position. Add border for user's army.
    useEffect(() => {
        const clearBoard = () => {
            const boardElements = document.getElementsByClassName("army-emoji");
            Array.from(boardElements).forEach((element: any) => {
                element.innerHTML = "";
                element.style.border = "0.5px solid rgba(0, 0, 0, 0.1)"; // Clear the border
            });
        };

        if (myArmyPosition) {
            // Clear the board before redeploying army emojis
            clearBoard();

            myArmyPosition.forEach((data: any) => {
                const element = document.getElementById(
                    `${data.myArmyPosition.y},${data.myArmyPosition.x}`
                )!;
                element.innerHTML = "⚔️";
                element.style.border = "2px solid";
                element.style.borderColor = colorPath[Number(data.myArmyColor.colorIndex)];
            });
        }

        setNumberOfArmy(myArmyNumber);

        //Puts the army emojis to army positions
        armyPositions.map((data: any) => {
            const element = document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!;
            element.innerHTML = "⚔️";
            element.style.border = "2px solid";
            element.style.borderColor = colorPath[Number(data.armyColor.colorIndex)]
            element.classList.add("army-emoji");
        });
    }, [armyPositions, myArmyPosition, myArmyNumber]);

    // Army Update Drawer data-bs attributes
    useEffect(() => {
        if (isArmyUpdateStage && myCastlePosition) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (
                                canCastleBeSettle(values[data.x][data.y]) &&
                                !isBorder &&
                                isMyArmy({ x: data.x, y: data.y }, myArmyPosition)
                            ) {
                                const element = document.getElementById(`${data.y},${data.x}`)!;
                                if (element) {
                                    element.classList.add("orangeTileEffect");
                                    element.setAttribute("data-bs-toggle", "modal");
                                    element.setAttribute("data-bs-target", "#armyUpdateModal");
                                }
                            }
                        }
                    }
                );
            });
        } else if (!isArmyUpdateStage && myCastlePosition) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (getArmySettlePositions(data.x, data.y, myCastlePosition)) {
                                document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                            }
                        }
                    }
                );
            });
        }
    }, [myArmyPosition, isArmyUpdateStage, myCastlePosition, isBorder, values]);

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

    // Handle Army Merge OffCanvas
    useEffect(() => {
        myArmyPosition.map((position) => {
            getArmyMergePositions(position.myArmyPosition).map((mergePosition) => {
                if (fromArmyPosition && isArmyMergeStage) {
                    isArmyMergePosition(mergePosition.x, mergePosition.y, fromArmyPosition) &&
                        isMyArmy({ x: mergePosition.x, y: mergePosition.y }, myArmyPosition) &&
                        document.getElementById(`${mergePosition.y},${mergePosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

                    isArmyMergePosition(mergePosition.x, mergePosition.y, fromArmyPosition) &&
                        isMyArmy({ x: mergePosition.x, y: mergePosition.y }, myArmyPosition) &&
                        document.getElementById(`${mergePosition.y},${mergePosition.x}`)!.setAttribute("data-bs-target", "#armyMergeDrawer");
                }
            })
        })

        return () => {
            if (myArmyPosition.length > 0) {
                myArmyPosition.map((data: any) => {
                    if (document.getElementById(`${data.myArmyPosition.y},${data.myArmyPosition.x}`) !== null) {
                        document.getElementById(`${data.myArmyPosition.y},${data.myArmyPosition.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.myArmyPosition.y},${data.myArmyPosition.x}`)!.setAttribute("data-bs-target", "");
                    }
                })
            }
        }
    }, [isArmyMergeStage, fromArmyPosition, myArmyPosition])
}