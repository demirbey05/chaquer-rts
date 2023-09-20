import shipEmoji from "../../../images/shipAssets/ship_emoji.png"
import { useEffect } from "react";
import { getManhattanPositions } from "../../../utils/helperFunctions/CustomFunctions/getManhattanPositions";
import { canFleetBeSettled } from "../../../utils/helperFunctions/SeaFunctions/canFleetBeSettled";
import { colorPath } from "../../../utils/constants/constants";
import { isMyFleet } from "../../../utils/helperFunctions/SeaFunctions/isMyFleet";

export const FleetEffects = (myFleetPositions: any[] | undefined, fleetPositions: any[], fleetSettleStage: boolean, myDockPositions: any[] | undefined, isBorder: boolean, values: number[][]) => {

    // Orange hover effect for fleet deployment
    useEffect(() => {
        if (fleetSettleStage && myDockPositions && fleetPositions) {
            myDockPositions.map((position: any) => {
                getManhattanPositions(position.myDockPosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (
                                !isBorder &&
                                canFleetBeSettled(values[data.x][data.y]) &&
                                !isMyFleet({ x: data.x, y: data.y }, myFleetPositions)
                            ) {
                                const element = document.getElementById(`${data.y},${data.x}`)!;
                                if (element) {
                                    element.classList.add("orangeTileEffect");
                                    element.setAttribute("data-bs-toggle", "modal");
                                    element.setAttribute("data-bs-target", "#fleetSettleModal");
                                }
                            }
                        }
                    }
                );
            });
        } else if (!fleetSettleStage && myDockPositions) {
            myDockPositions.map((position: any) => {
                getManhattanPositions(position.myDockPosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect")
                            document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                            document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                        }
                    }
                );
            });
        }
    }, [fleetSettleStage, myDockPositions, fleetPositions]);

    // Deploy ship emojis to position. Add border for user's fleet.
    useEffect(() => {
        const clearBoard = () => {
            const boardElements = document.getElementsByClassName("fleet-emoji");
            Array.from(boardElements).forEach((element: any) => {
                element.innerHTML = "";
                element.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
            });
        };

        if (myFleetPositions) {
            clearBoard();

            myFleetPositions.map((data: any) => {
                const element = document.getElementById(`${data.myFleetPosition.y},${data.myFleetPosition.x}`)!;
                element.innerHTML = '<img src="' + shipEmoji + '" width="20px" height="20px" />';
                element.style.border = "2px solid";
                element.style.borderColor = colorPath[Number(data.myFleetColor.colorIndex)];
            });
        }

        //Puts the ship emojis to fleet positions
        fleetPositions.map((data: any) => {
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.innerHTML = '<img src="' + shipEmoji + '" width="20px" height="20px" />';
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.style.border = "2px solid";
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.style.borderColor = colorPath[Number(data.fleetColor.colorIndex)];
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)?.classList.add("fleet-emoji");
        });
    }, [fleetPositions, myFleetPositions]);
}