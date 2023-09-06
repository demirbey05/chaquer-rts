import { useMUD } from "../../MUDContext";
import { Entity } from "@latticexyz/recs";
import { useRef, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { usePlayer } from "../../context/PlayerContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useMyDockPositions } from "../../hooks/useMyDockPositions";
import { useCredit } from "../../hooks/useCredit";
import { useNumberOfResource } from "../../hooks/useNumberOfResource";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const DockSettleModal = () => {
    const { systemCalls, components } = useMUD();
    const movingArmyId = useRef<Entity>("0" as Entity);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const { armyPositionToSettleDock, dockPosition, setDockPosition, setArmyPositionToSettleDock, setDockSettleStage } = useSea();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { userWallet } = usePlayer();

    const myDockPositions = useMyDockPositions(userWallet);
    const myCredit = useCredit(1, userWallet);
    const myResources = useNumberOfResource(userWallet, 1);

    useEffect(() => {
        if (myDockPositions && myCredit && myResources) {
            if (Number(getNumberFromBigInt(myCredit)) >= (100 * (myDockPositions.length + 1)) && Number(myResources.numOfWood) >= (1500 * (myDockPositions.length + 1))) {
                setIsDisabled(false)
            }
            else {
                setIsDisabled(true)
            }
        }
    }, [myDockPositions, myCredit, myResources])

    const handleSettle = async () => {
        const movingArmyIdMap = findIDFromPosition(
            armyPositionToSettleDock,
            components.Position
        );

        if (movingArmyIdMap !== null) {
            movingArmyId.current = [...movingArmyIdMap][0];
        }

        const tx = await systemCalls.buildDock(
            dockPosition.x,
            dockPosition.y,
            movingArmyId.current,
            1
        )
        if (tx == null) {
            setErrorMessage("An error occurred while trying to settle dock.")
            setErrorTitle("Dock Settle Error")
            setShowError(true)
            return
        }
    };

    const handleMove = async () => {
        const movingArmyIdMap = findIDFromPosition(
            armyPositionToSettleDock,
            components.Position
        );

        if (movingArmyIdMap !== null) {
            movingArmyId.current = [...movingArmyIdMap][0];
        }

        if (dockPosition) {
            const tx = await systemCalls.moveArmy(
                movingArmyId.current,
                dockPosition.x,
                dockPosition.y,
                1
            )
            if (tx == null) {
                setErrorMessage("An error occurred while trying to move army.")
                setErrorTitle("Army Move Error")
                setShowError(true)
                return
            }

            document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.innerHTML = "";
            document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";

            setDockSettleStage(false);
            setArmyPositionToSettleDock(undefined);
            setDockPosition(undefined);
        };
    }

    return (
        <>
            <div
                className="modal fade"
                id="dockSettleModal"
                data-bs-backdrop="static"
                aria-labelledby="dockSettleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header justify-center">
                            <h1 className="modal-title text-2xl" id="dockSettleModalLabel">
                                Dock Settlement
                            </h1>
                        </div>
                        <div className="modal-body font-bold">
                            <span>{"You are going to deploy a dock ⚓. Price of this dock ⚓ is "}</span>
                            {myDockPositions && (100 * (myDockPositions.length + 1))} 💰 + {myDockPositions && (1500 * (myDockPositions.length + 1))} 🪓 ,
                            <span>{" are you sure?"}</span>
                        </div>
                        <div className="modal-footer d-flex justify-between">
                            <Button
                                colorScheme="linkedin"
                                border="solid"
                                textColor="dark"
                                data-bs-dismiss="modal"
                                onClick={() => handleMove()}
                            >
                                Move Army
                            </Button>
                            <Button
                                colorScheme="red"
                                border="solid"
                                textColor="dark"
                                data-bs-dismiss="modal"
                            >
                                Back to Map
                            </Button>
                            <Button
                                colorScheme="whatsapp"
                                border="solid"
                                textColor="dark"
                                data-bs-dismiss="modal"
                                isDisabled={isDisabled}
                                onClick={() => handleSettle()}
                            >
                                Settle Dock
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}