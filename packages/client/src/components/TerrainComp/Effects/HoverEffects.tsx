import { useEffect } from 'react'
import { getManhattanPositions } from '../../../utils/helperFunctions/CustomFunctions/getManhattanPositions';
import { canCastleBeSettle } from '../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle';
import { isResourcePosition } from '../../../utils/helperFunctions/ResourceFuntions/isResourcePosition';
import { isArmyPosition } from '../../../utils/helperFunctions/ArmyFunctions/isArmyPosition';
import { getArmySettlePositions } from '../../../utils/helperFunctions/ArmyFunctions/getArmySettlePositions';
import { canFleetBeSettled } from '../../../utils/helperFunctions/SeaFunctions/canFleetBeSettled';
import { isMyCastle } from '../../../utils/helperFunctions/CastleFunctions/isMyCastle';
import { isEnemyCastle } from '../../../utils/helperFunctions/CastleFunctions/isEnemyCastle';
import { isMyArmy } from '../../../utils/helperFunctions/ArmyFunctions/isMyArmy';
import { isMyResource } from '../../../utils/helperFunctions/ResourceFuntions/isMyResource';
import { isMyDock } from '../../../utils/helperFunctions/SeaFunctions/isMyDock';
import { isMyFleet } from '../../../utils/helperFunctions/SeaFunctions/isMyFleet';
import { isEnemyDock } from '../../../utils/helperFunctions/SeaFunctions/isEnemyDock';

export const HoverEffects = (myFleetPositions: any[] | undefined,
    myDockPositions: any[] | undefined,
    myResourcePositions: any[],
    myArmyPosition: any[],
    dockPositions: any[],
    fromFleetPosition: any,
    isFleetMoveStage: boolean,
    armyPositions: any[],
    resources: any[],
    numberOfArmy: any,
    isArmySettleStage: boolean | undefined,
    castlePositions: any[],
    myCastlePosition: any[],
    values: number[][],
    fromArmyPosition: { x: any, y: any } | undefined,
    isArmyMoveStage: boolean | undefined,
    fleetSettleStage: boolean,
    fleetPositions: any[]
) => {

    //Blue hover effect when user moves an army
    useEffect(() => {
        if (fromArmyPosition && isArmyMoveStage && myCastlePosition) {
            getManhattanPositions({
                x: parseInt(fromArmyPosition.x),
                y: parseInt(fromArmyPosition.y),
            }).map((data) => {
                if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                    canCastleBeSettle(values[data.x][data.y]) &&
                        canCastleBeSettle(values[fromArmyPosition.x][fromArmyPosition.y]) &&
                        !isMyCastle(myCastlePosition, data.x, data.y) &&
                        !isMyArmy({ x: data.x, y: data.y }, myArmyPosition) &&
                        !isMyResource(data.x, data.y, myResourcePositions) &&
                        !isMyDock(data.x, data.y, myDockPositions) &&
                        document.getElementById(`${data.y},${data.x}`)?.classList.add("blueTileEffect");
                }
            });

        }

        return () => {
            if (fromArmyPosition) {
                getManhattanPositions({
                    x: parseInt(fromArmyPosition.x),
                    y: parseInt(fromArmyPosition.y),
                }).map((data) => {
                    if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                        if (canCastleBeSettle(values[data.x][data.y])) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("blueTileEffect");
                        }
                    }
                });
            }
        }
    }, [fromArmyPosition, isArmyMoveStage, myCastlePosition, myArmyPosition, myResourcePositions, myDockPositions, values]);

    //Orange hover effect and Army Settle data-bs
    useEffect(() => {
        if (isArmySettleStage && myCastlePosition) {
            myCastlePosition.map((position: any) => {
                getManhattanPositions(position.myCastlePosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (
                                numberOfArmy !== (5 + myCastlePosition.length - 1) &&
                                canCastleBeSettle(values[data.x][data.y]) &&
                                !isResourcePosition(data.x, data.y, resources) &&
                                !isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
                                !isMyCastle(myCastlePosition, data.x, data.y) &&
                                !isArmyPosition(data.x, data.y, armyPositions) &&
                                !isMyDock(data.x, data.y, myDockPositions) &&
                                !isEnemyDock({ x: data.x, y: data.y }, dockPositions, myDockPositions) &&
                                getArmySettlePositions(data.x, data.y, myCastlePosition)
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
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (getArmySettlePositions(data.x, data.y, myCastlePosition)) {
                                document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect")
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                            }
                        }
                    }
                );
            });
        }
    }, [isArmySettleStage, myCastlePosition, resources, myCastlePosition, castlePositions, armyPositions, dockPositions, values, myDockPositions]);

    // Orange hover effect - Fleet Settle data-bs
    useEffect(() => {
        if (fleetSettleStage && myDockPositions && fleetPositions) {
            myDockPositions.map((position: any) => {
                getManhattanPositions(position.myDockPosition).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            if (
                                canFleetBeSettled(values[data.x][data.y]) &&
                                !isMyFleet({ x: data.x, y: data.y }, myFleetPositions) &&
                                !isResourcePosition(data.x, data.y, resources)
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
                        if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect")
                            document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                            document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
                        }
                    }
                );
            });
        }
    }, [fleetSettleStage, myDockPositions, fleetPositions, resources]);

    //Yellow hover effect when user moves a fleet
    useEffect(() => {
        if (fromFleetPosition && isFleetMoveStage && !isArmyMoveStage) {
            getManhattanPositions({
                x: parseInt(fromFleetPosition.x),
                y: parseInt(fromFleetPosition.y),
            }).map((data) => {
                if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                    canFleetBeSettled(values[data.x][data.y]) &&
                        !isMyFleet({ x: data.x, y: data.y }, myFleetPositions) &&
                        !isMyResource(data.x, data.y, myResourcePositions) &&
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
                    if (data.x >= 0 && data.y >= 0 && data.x < 25 && data.y < 25) {
                        if (canFleetBeSettled(values[data.x][data.y])) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("yellowTileEffect");
                        }
                    }
                });
            }
        }
    }, [fromFleetPosition, isFleetMoveStage, myFleetPositions, myResourcePositions, isArmyMoveStage, values]);


}