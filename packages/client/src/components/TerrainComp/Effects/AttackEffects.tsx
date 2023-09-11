import { useEffect } from "react"
import { isManhattanPosition } from "../../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { isMyArmy } from "../../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyCastle } from "../../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { isMyFleet } from "../../../utils/helperFunctions/SeaFunctions/isMyFleet";

export const AttackEffects = (myFleetPositions: any[], fleetPositions: any[], fromFleetPosition: any, isFleetAttackStage: boolean, myCastlePosition: any[], castlePositions: any[], armyPositions: any[], myArmyPosition: any[], isAttackStage: boolean | undefined, fromArmyPosition: { x: any, y: any } | undefined,) => {
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