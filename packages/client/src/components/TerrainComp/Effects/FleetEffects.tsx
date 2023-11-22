import shipTile from '../../../images/shipAssets/small_ship.png'
import { useEffect } from "react";
import { getBorderColor } from "../../../utils/constants/getBorderColors";
import { getManhattanPositions } from '../../../utils/helperFunctions/CustomFunctions/getManhattanPositions';
import { canCastleBeSettle } from '../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle';
import { isMyFleet } from '../../../utils/helperFunctions/SeaFunctions/isMyFleet';
import { getArmyMovePositions } from '../../../utils/helperFunctions/ArmyFunctions/getArmyMovePositions';
import { isManhattanPosition } from '../../../utils/helperFunctions/CustomFunctions/isManhattanPosition';

export const FleetEffects = (
    myFleetPositions: any[] | undefined,
    fleetPositions: any[],
    values: number[][],
    isFleetLoadStage: boolean,
    myArmyPositions: any[],
    fromArmyPosition: any
) => {
    // Deploy my ships
    useEffect(() => {
        if (myFleetPositions) {
            myFleetPositions.map((data: any) => {
                const element = document.getElementById(`${data.myFleetPosition.y},${data.myFleetPosition.x}`)!;
                if (element) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }

                    const imgElement = document.createElement("img");
                    imgElement.src = shipTile;
                    imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                    imgElement.style.height = "100px"
                    imgElement.style.width = "75px"
                    imgElement.style.marginBottom = "15px"
                    imgElement.style.marginRight = "10px"
                    imgElement.style.zIndex = "1"
                    imgElement.style.pointerEvents = "none"

                    element.appendChild(imgElement);
                    element.style.border = "2px solid";
                    element.style.borderColor = getBorderColor(Number(data.myFleetColor.colorIndex));
                }
            });
        }

        return () => {
            if (myFleetPositions) {
                myFleetPositions.map((data: any) => {
                    const element = document.getElementById(`${data.myFleetPosition.y},${data.myFleetPosition.x}`)!;
                    if (element && element.children[0]) {
                        element.style.border = "";
                        element.removeChild(element.children[0])
                    }
                });
            }
        }
    }, [myFleetPositions])


    // Deploy ship emojis to position. Add border for user's fleet.
    useEffect(() => {
        fleetPositions.map((data: any) => {
            const element = document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!;
            if (element) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }

                const imgElement = document.createElement("img");
                imgElement.src = shipTile;
                imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                imgElement.style.height = "100px"
                imgElement.style.width = "75px"
                imgElement.style.marginBottom = "15px"
                imgElement.style.marginRight = "10px"
                imgElement.style.zIndex = "1"
                imgElement.style.pointerEvents = "none"

                element.appendChild(imgElement);
                element.style.border = "2px solid";
                element.style.borderColor = getBorderColor(Number(data.fleetColor.colorIndex));
                element.classList.add("fleet-emoji");
            }
        });

        return () => {
            if (fleetPositions) {
                fleetPositions.map((data: any) => {
                    const element = document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!;
                    if (element && element.children[0]) {
                        element.style.border = "";
                        element.removeChild(element.children[0])
                    }
                });
            }
        }
    }, [fleetPositions]);

    // Fleet Load Modal data-bs attributes
    useEffect(() => {
        if (isFleetLoadStage && myArmyPositions && myArmyPositions.length > 0) {
            myArmyPositions.map((position: any) => {
                getManhattanPositions({ x: position.myArmyPosition.x, y: position.myArmyPosition.y }).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (
                                canCastleBeSettle(values[data.x][data.y]) &&
                                isMyFleet({ x: data.x, y: data.y }, myFleetPositions)
                            ) {
                                const element = document.getElementById(`${data.y},${data.x}`)!;
                                if (element) {
                                    element.classList.add("greenTileEffect");
                                    element.setAttribute("data-bs-toggle", "modal");
                                    element.setAttribute("data-bs-target", "#fleetLoadModal");
                                }
                            }
                        }
                    }
                );
            });
        } else if (!isFleetLoadStage && myArmyPositions && myArmyPositions.length > 0) {
            myArmyPositions.map((position: any) => {
                getManhattanPositions({ x: position.myArmyPosition.x, y: position.myArmyPosition.y }).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (getArmyMovePositions(data.x, data.y, myArmyPositions)) {
                                document.getElementById(`${data.y},${data.x}`)?.classList.remove("greenTileEffect");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                            }
                        }
                    }
                );
            });
        }
    }, [myFleetPositions, isFleetLoadStage, myArmyPositions, values, fromArmyPosition]);
}