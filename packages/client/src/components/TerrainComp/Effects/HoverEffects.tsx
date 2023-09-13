import { useEffect } from 'react'
import { getManhattanPositions } from '../../../utils/helperFunctions/CustomFunctions/getManhattanPositions';
import { canCastleBeSettle } from '../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle';
import { isCastlePosition } from '../../../utils/helperFunctions/CastleFunctions/isCastlePosition';
import { isResourcePosition } from '../../../utils/helperFunctions/ResourceFuntions/isResourcePosition';
import { isArmyPosition } from '../../../utils/helperFunctions/ArmyFunctions/isArmyPosition';
import { armySettlePositions } from '../../../utils/helperFunctions/ArmyFunctions/armySettlePositions';
import { canFleetBeSettled } from '../../../utils/helperFunctions/SeaFunctions/canFleetBeSettled';
import { isMyCastle } from '../../../utils/helperFunctions/CastleFunctions/isMyCastle';
import { isDockPosition } from '../../../utils/helperFunctions/SeaFunctions/isDockPosition';
import { isEnemyCastle } from '../../../utils/helperFunctions/CastleFunctions/isEnemyCastle';
import { isMyArmy } from '../../../utils/helperFunctions/ArmyFunctions/isMyArmy';
import { isMyResource } from '../../../utils/helperFunctions/ResourceFuntions/isMyResource';
import { isMyDock } from '../../../utils/helperFunctions/SeaFunctions/isMyDock';
import { isMyFleet } from '../../../utils/helperFunctions/SeaFunctions/isMyFleet';

export const HoverEffects = (myFleetPositions: any[] | undefined, myDockPositions: any[], myResourcePositions: any[], myArmyPosition: any[], dockPositions: any[], fromFleetPosition: any, isFleetMoveStage: boolean, armyPositions: any[], resources: any[], numberOfArmy: any, isArmySettleStage: boolean | undefined, isBorder: boolean, castlePositions: any[], myCastlePosition: any[], values: number[][], fromArmyPosition: { x: any, y: any } | undefined, isArmyMoveStage: boolean | undefined) => {
    //Blue hover effect when user moves an army
    useEffect(() => {
        if (fromArmyPosition && isArmyMoveStage && myCastlePosition) {
            getManhattanPositions({
                x: parseInt(fromArmyPosition.x),
                y: parseInt(fromArmyPosition.y),
            }).map((data) => {
                if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                    canCastleBeSettle(values[data.x][data.y]) &&
                        !isMyCastle(myCastlePosition, data.x, data.y) &&
                        !isMyArmy({ x: data.x, y: data.y }, myArmyPosition) &&
                        !isMyResource(data.x, data.y, myResourcePositions) &&
                        !isMyDock(data.x, data.y, myDockPositions) &&
                        !isBorder &&
                        document.getElementById(`${data.y},${data.x}`)?.classList.add("blueTileEffect");

                    if (isMyCastle(myCastlePosition, data.x, data.y)) {
                        document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none"
                    }
                }
            });

        }

        return () => {
            if (fromArmyPosition && myCastlePosition) {
                getManhattanPositions({
                    x: parseInt(fromArmyPosition.x),
                    y: parseInt(fromArmyPosition.y),
                }).map((data) => {
                    if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                        if (canCastleBeSettle(values[data.x][data.y])) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("blueTileEffect");
                        }

                        if (isMyCastle(myCastlePosition, data.x, data.y)) {
                            document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "auto"
                        }
                    }
                });
            }
        }
    }, [fromArmyPosition, isArmyMoveStage, myCastlePosition]);

    //Orange hover effect and data-bs assign when user deploys an army
    useEffect(() => {
        if (isArmySettleStage && myCastlePosition) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (
                                numberOfArmy !== 5 &&
                                canCastleBeSettle(values[data.x][data.y]) &&
                                !isBorder &&
                                !isResourcePosition(data.x, data.y, resources) &&
                                !isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
                                !isMyCastle(myCastlePosition, data.x, data.y) &&
                                !isArmyPosition(data.x, data.y, armyPositions) &&
                                !isDockPosition(data.x, data.y, dockPositions) &&
                                armySettlePositions(data.x, data.y, myCastlePosition)
                            ) {
                                const element = document.getElementById(`${data.y},${data.x}`)!;
                                if (element) {
                                    element.classList.add("orangeTileEffect");
                                    element.setAttribute("data-bs-toggle", "modal");
                                    element.setAttribute("data-bs-target", "#armySettleModal");
                                }
                            }
                        }
                    }
                );
            });
        } else if (!isArmySettleStage && myCastlePosition && numberOfArmy !== 5) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (armySettlePositions(data.x, data.y, myCastlePosition)) {
                                document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect")
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                            }
                        }
                    }
                );
            });
        }
    }, [isArmySettleStage, myCastlePosition]);

    //Yellow hover effect when user moves a fleet
    useEffect(() => {
        if (fromFleetPosition && isFleetMoveStage) {
            getManhattanPositions({
                x: parseInt(fromFleetPosition.x),
                y: parseInt(fromFleetPosition.y),
            }).map((data) => {
                if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                    canFleetBeSettled(values[data.x][data.y]) &&
                        !isMyFleet({ x: data.x, y: data.y }, myFleetPositions) &&
                        !isMyResource(data.x, data.y, myResourcePositions) &&
                        !isBorder &&
                        document.getElementById(`${data.y},${data.x}`)?.classList.add("yellowTileEffect");
                }
            });

        }

        return () => {
            if (fromFleetPosition) {
                getManhattanPositions({
                    x: parseInt(fromFleetPosition.x),
                    y: parseInt(fromFleetPosition.y),
                }).map((data) => {
                    if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                        if (canFleetBeSettled(values[data.x][data.y])) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("yellowTileEffect");
                        }
                    }
                });
            }
        }
    }, [fromFleetPosition, isFleetMoveStage]);
}