import { useEffect } from "react"
import { getBorderColor } from "../../../utils/constants/getBorderColors";
import { getManhattanPositions } from "../../../utils/helperFunctions/CustomFunctions/getManhattanPositions";
import { canCastleBeSettle } from "../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { getArmySettlePositions } from "../../../utils/helperFunctions/ArmyFunctions/getArmySettlePositions";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";
import { getArmyMergePositions } from "../../../utils/helperFunctions/ArmyFunctions/getArmyMergePositions";
import { isArmyMergePosition } from "../../../utils/helperFunctions/ArmyFunctions/isArmyMergePositions";
import ottomanAsset from '../../../images/armyAssets/ottoman-soldier.png'
import artillery from '../../../images/armyAssets/artillery.png'
import armyTile from '../../../images/armyAssets/army.png';
import { isMyFleet } from "../../../utils/helperFunctions/SeaFunctions/isMyFleet";

export const ArmyEffects = (isArmyUpdateStage: boolean,
    values: number[][],
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
    fromArmyPosition: any,
    myFleetPositions: any[] | undefined,
    myArtilleryPositions: any[],
    artilleryPositions: any[]
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

    // Deploy and handle my army tiles
    useEffect(() => {
        if (myArmyPosition) {
            myArmyPosition.forEach((data: any) => {
                const element = document.getElementById(
                    `${data.myArmyPosition.y},${data.myArmyPosition.x}`
                )!;
                if (element) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }

                    const imgElement = document.createElement("img");
                    imgElement.src = ottomanAsset;
                    imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                    imgElement.style.height = "100px"
                    imgElement.style.width = "75px"
                    imgElement.style.marginBottom = "15px"
                    imgElement.style.marginRight = "15px"
                    imgElement.style.zIndex = "1"
                    imgElement.style.pointerEvents = "none"

                    element.appendChild(imgElement);
                    element.style.border = "2px solid";
                    element.style.borderColor = getBorderColor(Number(data.myArmyColor.colorIndex));
                    element.classList.add("army-emoji");
                }
            });
        }

        setNumberOfArmy(myArmyNumber);

        return () => {
            if (myArmyPosition) {
                myArmyPosition.forEach((data: any) => {
                    const element = document.getElementById(
                        `${data.myArmyPosition.y},${data.myArmyPosition.x}`
                    )!;
                    if (element && element.children[0]) {
                        element.style.border = ""
                        element.removeChild(element.children[0])
                    }
                });
            }
        }

    }, [myArmyPosition])

    // Deploy army emojis to position. Add border for user's army.
    useEffect(() => {
        armyPositions.map((data: any) => {
            const element = document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!;
            if (element) {
                // Check if there's already a child image, and remove it if it exists
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }

                const imgElement = document.createElement("img");
                imgElement.src = ottomanAsset;
                imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)";
                imgElement.style.height = "100px";
                imgElement.style.width = "75px";
                imgElement.style.marginBottom = "15px";
                imgElement.style.marginRight = "15px";
                imgElement.style.zIndex = "1"
                imgElement.style.pointerEvents = "none"

                element.appendChild(imgElement);
                element.style.border = "2px solid";
                element.style.borderColor = getBorderColor(Number(data.armyColor.colorIndex));
                element.classList.add("army-emoji");
            }
        });

        return () => {
            if (armyPositions) {
                armyPositions.map((data: any) => {
                    const element = document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!;
                    if (element && element.children[0]) {
                        element.style.border = "";
                        element.removeChild(element.children[0]);
                    }
                });
            }
        }
    }, [armyPositions]);


    // Army Update Drawer data-bs attributes
    useEffect(() => {
        if (isArmyUpdateStage && myCastlePosition) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (
                                values.length > 0 &&
                                canCastleBeSettle(values[data.x][data.y]) &&
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
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
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
    }, [myArmyPosition, isArmyUpdateStage, myCastlePosition, values]);

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
                if (fromArmyPosition && isArmyMergeStage && myFleetPositions && myArmyPosition) {
                    isArmyMergePosition(mergePosition.x, mergePosition.y, fromArmyPosition) &&
                        !isMyFleet({ x: fromArmyPosition.x, y: fromArmyPosition.y }, myFleetPositions) &&
                        !isMyFleet({ x: mergePosition.x, y: mergePosition.y }, myFleetPositions) &&
                        isMyArmy({ x: mergePosition.x, y: mergePosition.y }, myArmyPosition) &&
                        document.getElementById(`${mergePosition.y},${mergePosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

                    isArmyMergePosition(mergePosition.x, mergePosition.y, fromArmyPosition) &&
                        !isMyFleet({ x: fromArmyPosition.x, y: fromArmyPosition.y }, myFleetPositions) &&
                        !isMyFleet({ x: mergePosition.x, y: mergePosition.y }, myFleetPositions) &&
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
    }, [isArmyMergeStage, fromArmyPosition, myArmyPosition, myFleetPositions])

    // Deploy and handle my artillery
    useEffect(() => {
        if (myArtilleryPositions) {
            myArtilleryPositions.forEach((data: any) => {
                const element = document.getElementById(
                    `${data.myArtilleryPosition.y},${data.myArtilleryPosition.x}`
                )!;
                if (element) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }

                    const imgElement = document.createElement("img");
                    imgElement.src = artillery;
                    imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                    imgElement.style.height = "75px"
                    imgElement.style.width = "80px"
                    imgElement.style.scale = "1.25"
                    imgElement.style.marginBottom = "10px"
                    imgElement.style.marginRight = "15px"
                    imgElement.style.zIndex = "1"
                    imgElement.style.pointerEvents = "none"

                    element.appendChild(imgElement);
                    element.style.border = "2px solid";
                    element.style.borderColor = getBorderColor(Number(data.myArtilleryColor.colorIndex));
                }
            });
        }

        return () => {
            if (myArtilleryPositions) {
                myArtilleryPositions.forEach((data: any) => {
                    const element = document.getElementById(
                        `${data.myArtilleryPosition.y},${data.myArtilleryPosition.x}`
                    )!;
                    if (element && element.children[0]) {
                        element.style.border = ""
                        element.removeChild(element.children[0])
                    }
                });
            }
        }

    }, [myArtilleryPositions])

    // Deploy artillery to position. Add border for user's artillery.
    useEffect(() => {
        artilleryPositions.map((data: any) => {
            const element = document.getElementById(`${data.artilleryPosition.y},${data.artilleryPosition.x}`)!;
            if (element) {
                // Check if there's already a child image, and remove it if it exists
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }

                const imgElement = document.createElement("img");
                imgElement.src = artillery;
                imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)";
                imgElement.style.height = "75px";
                imgElement.style.width = "80px";
                imgElement.style.marginBottom = "10px";
                imgElement.style.marginRight = "15px";
                imgElement.style.zIndex = "1"
                imgElement.style.pointerEvents = "none"

                element.appendChild(imgElement);
                element.style.border = "2px solid";
                element.style.borderColor = getBorderColor(Number(data.artilleryColor.colorIndex));
            }
        });

        return () => {
            if (artilleryPositions) {
                artilleryPositions.map((data: any) => {
                    const element = document.getElementById(`${data.artilleryPosition.y},${data.artilleryPosition.x}`)!;
                    if (element && element.children[0]) {
                        element.style.border = "";
                        element.removeChild(element.children[0]);
                    }
                });
            }
        }
    }, [artilleryPositions]);
}