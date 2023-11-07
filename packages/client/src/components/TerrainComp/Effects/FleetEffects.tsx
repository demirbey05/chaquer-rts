import shipTile from '../../../images/shipAssets/small_ship.png'
import { useEffect } from "react";
import { getBorderColor } from "../../../utils/constants/getBorderColors";

export const FleetEffects = (myFleetPositions: any[] | undefined,
    fleetPositions: any[],
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
}