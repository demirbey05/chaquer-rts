import { useEffect } from "react"

export const ArmyEffects = (castlePositions: any[], isArmySettleStage: boolean | undefined, armyPositions: any[], myArmyPosition: any[], setNumberOfArmy: any, myArmyNumber: any, resources: any[]) => {
    //Makes castle, army and resource positions unClickable to not cause bug during army settlement
    useEffect(() => {
        if (castlePositions && isArmySettleStage) {
            castlePositions.map((data) => {
                document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
            });
        }

        if (armyPositions && isArmySettleStage) {
            armyPositions.map((data) => {
                document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
            });
        }

        if (resources && isArmySettleStage) {
            resources.map((data) => {
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
            });
        }
    }, [isArmySettleStage, castlePositions, armyPositions, resources]);

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
                    `${data.position.y},${data.position.x}`
                )!;
                element.innerHTML = "⚔️";
                element.style.border = "2px solid rgb(245, 169, 6)";
            });
        }

        setNumberOfArmy(myArmyNumber);

        //Puts the army emojis to army positions
        armyPositions.map((data: any) => {
            document.getElementById(
                `${data.position.y},${data.position.x}`
            )!.innerHTML = "⚔️";
            document
                .getElementById(`${data.position.y},${data.position.x}`)
                ?.classList.add("army-emoji");
        });
    }, [armyPositions, myArmyPosition]);
}