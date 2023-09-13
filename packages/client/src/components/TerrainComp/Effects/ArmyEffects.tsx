import { useEffect } from "react"
import { colorPath } from "../../../utils/constants/constants";

export const ArmyEffects = (dockPositions: any[], castlePositions: any[], isArmySettleStage: boolean | undefined, armyPositions: any[], myArmyPosition: any[], setNumberOfArmy: any, myArmyNumber: any, resources: any[]) => {
    //Makes castle, army and resource positions unClickable to not cause bug during army settlement
    useEffect(() => {
        if (castlePositions && isArmySettleStage) {
            castlePositions.map((data) => {
                document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-target", "");
            });
        }

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
    }, [isArmySettleStage, castlePositions, armyPositions, resources, dockPositions]);

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
}