import shipEmoji from "../../../images/shipAssets/ship_emoji.png"
import { useEffect } from "react";
import { getBorderColor } from "../../../utils/constants/getBorderColors";

export const FleetEffects = (myFleetPositions: any[] | undefined,
    fleetPositions: any[],
) => {
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
                element.style.borderColor = getBorderColor(Number(data.myFleetColor.colorIndex));
            });
        }

        //Puts the ship emojis to fleet positions
        fleetPositions.map((data: any) => {
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.innerHTML = '<img src="' + shipEmoji + '" width="20px" height="20px" />';
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.style.border = "2px solid";
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.style.borderColor = getBorderColor(Number(data.fleetColor.colorIndex));
            document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)?.classList.add("fleet-emoji");
        });
    }, [fleetPositions, myFleetPositions]);
}