import { useEffect } from "react"
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyCastle } from "../../../utils/helperFunctions/CastleFunctions/isEnemyCastle";

export const AttackEffects = (myCastlePosition: any[], castlePositions: any[], armyPositions: any[], myArmyPosition: any[], isAttackStage: boolean | undefined, fromArmyPosition: { x: any, y: any } | undefined,) => {
    // Handle Army and Castle Attack OffCanvas
    useEffect(() => {
        armyPositions.map((data: any) => {
            if (isAttackStage && fromArmyPosition) {
                isManhattanPosition(data.position, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
                    document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

                isManhattanPosition(data.position, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
                    document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "#armyAttackDrawer");
            }
        });

        castlePositions.map((data: any) => {
            if (isAttackStage && fromArmyPosition) {
                isManhattanPosition(data, fromArmyPosition.x, fromArmyPosition.y) &&
                    isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
                    document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data, fromArmyPosition.x, fromArmyPosition.y) &&
                    isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
                    document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "#castleAttackDrawer");
            }
        });

        return () => {
            if (castlePositions.length > 0) {
                castlePositions.map((data: any) => {
                    if (document.getElementById(`${data.y},${data.x}`) !== null) {
                        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
                    }
                });
            }

            if (armyPositions.length > 0) {
                armyPositions.map((data: any) => {
                    if (document.getElementById(`${data.position.y},${data.position.x}`) !== null) {
                        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
                    }
                })
            }
        }
    }, [isAttackStage]);
}