import { useEffect } from "react"
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyCastle } from "../../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { isMyFleet } from "../../../utils/helperFunctions/SeaFunctions/isMyFleet";

export const AttackEffects = (myFleetPositions: any[] | undefined, fleetPositions: any[], fromFleetPosition: any, isFleetAttackStage: boolean, myCastlePosition: any[], castlePositions: any[], armyPositions: any[], myArmyPosition: any[], isAttackStage: boolean | undefined, fromArmyPosition: { x: any, y: any } | undefined,) => {
    // Handle Army and Castle Attack OffCanvas
    useEffect(() => {
        armyPositions.map((data: any) => {
            if (isAttackStage && fromArmyPosition) {
                isManhattanPosition(data.armyPosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyArmy({ x: data.armyPosition.x, y: data.armyPosition.y }, myArmyPosition) &&
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

                isManhattanPosition(data.armyPosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    !isMyArmy({ x: data.armyPosition.x, y: data.armyPosition.y }, myArmyPosition) &&
                    document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-target", "#armyAttackDrawer");
            }
        });

        castlePositions.map((data: any) => {
            if (isAttackStage && fromArmyPosition) {
                isManhattanPosition(data.castlePosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    isEnemyCastle({ x: data.castlePosition.x, y: data.castlePosition.y }, myCastlePosition, castlePositions) &&
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
                isManhattanPosition(data.castlePosition, fromArmyPosition.x, fromArmyPosition.y) &&
                    isEnemyCastle({ x: data.castlePosition.x, y: data.castlePosition.y }, myCastlePosition, castlePositions) &&
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-target", "#castleAttackDrawer");
            }
        });

        return () => {
            if (castlePositions.length > 0) {
                castlePositions.map((data: any) => {
                    if (document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`) !== null) {
                        document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.setAttribute("data-bs-target", "");
                    }
                });
            }

            if (armyPositions.length > 0) {
                armyPositions.map((data: any) => {
                    if (document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`) !== null) {
                        document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.armyPosition.y},${data.armyPosition.x}`)!.setAttribute("data-bs-target", "");
                    }
                })
            }
        }
    }, [isAttackStage]);

    // Handle fleet attack drawer
    useEffect(() => {
        fleetPositions.map((data: any) => {
            if (isFleetAttackStage && fromFleetPosition) {
                isManhattanPosition(data.fleetPosition, fromFleetPosition.x, fromFleetPosition.y) &&
                    !isMyFleet({ x: data.fleetPosition.x, y: data.fleetPosition.y }, myFleetPositions) &&
                    document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

                isManhattanPosition(data.fleetPosition, fromFleetPosition.x, fromFleetPosition.y) &&
                    !isMyFleet({ x: data.fleetPosition.x, y: data.fleetPosition.y }, myFleetPositions) &&
                    document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.setAttribute("data-bs-target", "#fleetAttackDrawer");
            }
        });

        return () => {
            if (fleetPositions.length > 0) {
                fleetPositions.map((data: any) => {
                    if (document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`) !== null) {
                        document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.setAttribute("data-bs-toggle", "");
                        document.getElementById(`${data.fleetPosition.y},${data.fleetPosition.x}`)!.setAttribute("data-bs-target", "");
                    }
                })
            }
        }
    }, [isFleetAttackStage]);
}