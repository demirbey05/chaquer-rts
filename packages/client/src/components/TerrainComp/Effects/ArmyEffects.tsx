import { useEffect } from "react"
import { colorPath } from "../../../utils/constants/constants";
import { isEnemyCastle } from "../../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { getManhattanPositions } from "../../../utils/helperFunctions/CustomFunctions/getManhattanPositions";
import { canCastleBeSettle } from "../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isResourcePosition } from "../../../utils/helperFunctions/ResourceFuntions/isResourcePosition";
import { isMyCastle } from "../../../utils/helperFunctions/CastleFunctions/isMyCastle";
import { armySettlePositions } from "../../../utils/helperFunctions/ArmyFunctions/armySettlePositions";
import { isDockPosition } from "../../../utils/helperFunctions/SeaFunctions/isDockPosition";
import { isEnemyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";

export const ArmyEffects = (isArmyUpdateStage: boolean, values: number[][], isBorder: boolean, myCastlePosition: any[], dockPositions: any[], castlePositions: any[], isArmySettleStage: boolean | undefined, armyPositions: any[], myArmyPosition: any[], setNumberOfArmy: any, myArmyNumber: any, resources: any[]) => {
    //Makes castle, army and resource positions unClickable to not cause bug during army settlement
    useEffect(() => {
        if (armyPositions && isArmySettleStage) {
            armyPositions.map((data) => {
                document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-target", "");
            });
        }

        if (resources && isArmySettleStage) {
            resources.map((data) => {
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
            });
        }

        if (dockPositions && isArmySettleStage) {
            dockPositions.map((data) => {
                document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.dockPosition.y},${data.dockPosition.x}`)!.setAttribute("data-bs-target", "");
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
    }, [armyPositions, myArmyPosition]);

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
                                !isResourcePosition(data.x, data.y, resources) &&
                                !isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
                                !isMyCastle(myCastlePosition, data.x, data.y) &&
                                !isDockPosition(data.x, data.y, dockPositions) &&
                                armySettlePositions(data.x, data.y, myCastlePosition)
                            ) {
                                const element = document.getElementById(`${data.y},${data.x}`)!;
                                if (element) {
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
                            if (armySettlePositions(data.x, data.y, myCastlePosition)) {
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                            }
                        }
                    }
                );
            });
        }
    }, [armyPositions, myArmyPosition, isArmyUpdateStage, myCastlePosition, resources, dockPositions]);
}