import { useEffect } from 'react'
import { getManhattanPositions } from '../../../utils/helperFunctions/CustomFunctions/getManhattanPositions';
import { canCastleBeSettle } from '../../../utils/helperFunctions/CastleFunctions/canCastleBeSettle';
import { isCastlePosition } from '../../../utils/helperFunctions/CastleFunctions/isCastlePosition';
import { isResourcePosition } from '../../../utils/helperFunctions/ResourceFuntions/isResourcePosition';
import { isArmyPosition } from '../../../utils/helperFunctions/ArmyFunctions/isArmyPosition';
import { armySettlePositions } from '../../../utils/helperFunctions/ArmyFunctions/armySettlePositions';

export const HoverEffects = (armyPositions: any[], resources: any[], numberOfArmy: any, isArmySettleStage: boolean | undefined, isBorder: boolean, castlePositions: any[], myCastlePosition: any[], values: number[][], fromArmyPosition: { x: any, y: any } | undefined, isArmyMoveStage: boolean | undefined) => {
    //Blue hover effect when user moves an army
    useEffect(() => {
        if (fromArmyPosition && isArmyMoveStage) {
            getManhattanPositions({
                x: parseInt(fromArmyPosition.x),
                y: parseInt(fromArmyPosition.y),
            }).map((data) => {
                if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                    canCastleBeSettle(values[data.x][data.y]) &&
                        !isCastlePosition(data.x, data.y, myCastlePosition) &&
                        !isBorder &&
                        document.getElementById(`${data.y},${data.x}`)?.classList.add("blueTileEffect");

                    if (isCastlePosition(data.x, data.y, myCastlePosition)) {
                        document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none"
                    }
                }
            });

        }

        return () => {
            if (fromArmyPosition) {
                getManhattanPositions({
                    x: parseInt(fromArmyPosition.x),
                    y: parseInt(fromArmyPosition.y),
                }).map((data) => {
                    if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                        if (canCastleBeSettle(values[data.x][data.y])) {
                            document.getElementById(`${data.y},${data.x}`)?.classList.remove("blueTileEffect");
                        }

                        if (isCastlePosition(data.x, data.y, myCastlePosition)) {
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
                getManhattanPositions(position).map(
                    (data) => {
                        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
                            if (
                                numberOfArmy !== 5 &&
                                !isBorder &&
                                !isResourcePosition(data.x, data.y, resources) &&
                                !isCastlePosition(data.x, data.y, castlePositions) &&
                                !isArmyPosition(data.x, data.y, armyPositions) &&
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
                getManhattanPositions(position).map(
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
}