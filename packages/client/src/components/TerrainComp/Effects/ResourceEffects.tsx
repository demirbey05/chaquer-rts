import { useEffect } from "react"
import { getBorderColor } from "../../../utils/constants/getBorderColors";
import { canCastleBeSettle } from "../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyResource } from "../../../utils/helperFunctions/ResourceFuntions/isMyResource";
import mountainTile from '../../../images/mapAssets/mountain.png'
import forestTile from '../../../images/resourceAssets/forest.png'
import farmTile from '../../../images/resourceAssets/food.png'
import mineTile from '../../../images/resourceAssets/mine.png'

export const ResourceEffects = (values: number[][],
    fromFleetPosition: any,
    seaMineStage: boolean,
    myResourcePositions: any[],
    resources: any[],
    isMineStage: boolean | undefined,
    fromArmyPosition: { x: any, y: any } | undefined
) => {
    // Deploy my resource assets
    useEffect(() => {
        if (myResourcePositions) {
            myResourcePositions.map((position: any) => {
                document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.border = "2px solid";
                document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.borderColor = getBorderColor(Number(position.myResourceColor.colorIndex));
            })
        }

        return () => {
            if (myResourcePositions) {
                myResourcePositions.map((position: any) => {
                    if (document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)) {
                        document.getElementById(`${position.myResourcePosition.y},${position.myResourcePosition.x}`)!.style.border = "";
                    }
                });
            }
        }
    }, [myResourcePositions])

    // Deploy users resource assets
    useEffect(() => {
        if (resources) {
            resources.map(data => {
                if (data.resource.sourceType === 0) {
                    const element = document.getElementById(`${data.positions.y},${data.positions.x}`)!;
                    if (element) {
                        const imgElement = document.createElement("img");
                        imgElement.src = farmTile;
                        imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                        imgElement.style.height = "100px"
                        imgElement.style.width = "75px"
                        imgElement.style.marginBottom = "15px"
                        imgElement.style.marginRight = "15px"
                        imgElement.style.zIndex = "1"
                        imgElement.style.pointerEvents = "none"
                        element.appendChild(imgElement);
                    }

                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = getBorderColor(Number(data.color.colorIndex));
                    }
                }
                else if (data.resource.sourceType === 1) {
                    const element = document.getElementById(`${data.positions.y},${data.positions.x}`)!;
                    if (element) {
                        const imgElement = document.createElement("img");
                        imgElement.src = forestTile;
                        imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                        imgElement.style.height = "100px"
                        imgElement.style.width = "100px"
                        imgElement.style.marginBottom = "25px"
                        imgElement.style.marginRight = "15px"
                        imgElement.style.zIndex = "1"
                        imgElement.style.pointerEvents = "none"
                        element.appendChild(imgElement);
                    }
                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = getBorderColor(Number(data.color.colorIndex));
                    }
                }
                else {
                    const element = document.getElementById(`${data.positions.y},${data.positions.x}`)!;
                    if (element) {
                        const imgElement = document.createElement("img");
                        imgElement.src = mineTile;
                        imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                        imgElement.style.height = "100px"
                        imgElement.style.width = "75px"
                        imgElement.style.marginBottom = "15px"
                        imgElement.style.marginRight = "15px"
                        imgElement.style.zIndex = "1"
                        imgElement.style.pointerEvents = "none"
                        element.appendChild(imgElement);
                    }
                    if (Number(data.color.colorIndex) !== 0) {
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.border = "2px solid";
                        document.getElementById(`${data.positions.y},${data.positions.x}`)!.style.borderColor = getBorderColor(Number(data.color.colorIndex));
                    }
                }
            })
        }

        return () => {
            if (resources) {
                resources.map((position: any) => {
                    const element = document.getElementById(`${position.positions.y},${position.positions.x}`)!;
                    if (element) {
                        element.style.border = "";
                        element.removeChild(element.children[0])
                    }
                });
            }
        };
    }, [resources])

    // Handle Mine Capture OffCanvas
    useEffect(() => {
        if (isMineStage && fromArmyPosition) {
            resources.map((data: any) => {
                values.length > 0 &&
                    isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
                    canCastleBeSettle(values[data.positions.x][data.positions.y]) &&
                    document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
                    values.length > 0 &&
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

    // Mountain Asset Deploy
    useEffect(() => {
        if (values && values.length > 0) {
            values.map((row, x) => {
                row.map((data, y) => {
                    if (data === 3) {
                        const element = document.getElementById(`${y},${x}`);
                        if (element) {
                            const imgElement = document.createElement("img");
                            imgElement.src = mountainTile;
                            imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                            imgElement.style.height = "100px"
                            imgElement.style.width = "75px"
                            imgElement.style.marginBottom = "15px"
                            imgElement.style.marginRight = "15px"
                            imgElement.style.zIndex = "1"
                            imgElement.style.pointerEvents = "none"

                            element.appendChild(imgElement);
                        }
                    }
                })
            });
        }

        return () => {
            if (values && values.length > 0) {
                values.map((row, x) => {
                    row.map((data, y) => {
                        if (data === 3) {
                            const element = document.getElementById(`${y},${x}`);
                            if (element) {
                                element.removeChild(element.children[0])
                            }
                        }
                    })
                });
            }
        }
    }, [values])
}