import { useRef, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { Entity } from "@latticexyz/recs";
import { useMUD } from "../../context/MUDContext";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { usePlayer } from "../../context/PlayerContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { useMyDockPositions } from "../../hooks/SeaHooks/useMyDockPositions";
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { useNumberOfResource } from "../../hooks/ResourceHooks/useNumberOfResource";
import { useGame } from "../../context/GameContext";

export const DockSettleModal = () => {
    const { systemCalls, components } = useMUD();
    const { armyPositionToSettleDock, dockPosition, setDockPosition, setArmyPositionToSettleDock, setDockSettleStage } = useSea();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { userWallet } = usePlayer();
    const { setIsArmyMoveStage } = useArmy();
    const { gameID } = useGame();

    const movingArmyId = useRef<Entity>("0" as Entity);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [isLoadingDock, setIsLoadingDock] = useState<boolean>(false);
    const [isLoadingMove, setIsLoadingMove] = useState<boolean>(false);

    const myDockPositions = useMyDockPositions(userWallet, gameID);
    const myCredit = useCredit(gameID, userWallet);
    const myResources = useNumberOfResource(userWallet, gameID);

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

    const handleBackMap = () => {
        setIsArmyMoveStage(false)
        setDockSettleStage(false);
        setArmyPositionToSettleDock(undefined);
        setDockPosition(undefined);
    }

    const handleSettle = async () => {
        const movingArmyIdMap = findIDFromPosition(
            armyPositionToSettleDock,
            components.Position,
            gameID
        );

        if (movingArmyIdMap !== null) {
            movingArmyId.current = [...movingArmyIdMap][0];
        }

        setIsArmyMoveStage(false)
        setIsLoadingDock(true)

        var targetDiv = document.getElementById(`${dockPosition.y},${dockPosition.x}`);
        targetDiv?.classList.add("animate-border-army-move");

        const tx = await systemCalls.buildDock(
            dockPosition.x,
            dockPosition.y,
            movingArmyId.current,
            gameID
        )

        if (tx == null) {
            setErrorMessage("An error occurred while trying to settle dock.")
            setErrorTitle("Dock Settle Error")
            setShowError(true)
        }
        else {
            setDockSettleStage(false);
            setDockPosition(undefined);
        }

        setIsLoadingDock(false)
        targetDiv?.classList.remove("animate-border-army-move");
    };

    const handleMove = async () => {
        const movingArmyIdMap = findIDFromPosition(
            armyPositionToSettleDock,
            components.Position,
            gameID
        );

        if (movingArmyIdMap !== null) {
            movingArmyId.current = [...movingArmyIdMap][0];
        }

        if (dockPosition) {
            setIsLoadingMove(true)
            var targetDiv = document.getElementById(`${dockPosition.y},${dockPosition.x}`);
            targetDiv?.classList.add("animate-border-army-move");

            try {
                await systemCalls.moveArmy(movingArmyId.current, dockPosition.x, dockPosition.y, gameID)

                document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.innerHTML = "";
                document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
            } catch (error) {
                setErrorMessage("You need 30 food + 30 gold to move your army.")
                setErrorTitle("Army Move Error")
                setShowError(true)
            } finally {
                targetDiv?.classList.remove("animate-border-army-move");
                setDockSettleStage(false);
                setIsArmyMoveStage(false)
                setArmyPositionToSettleDock(undefined);
                setDockPosition(undefined);
                setIsLoadingMove(false)
            }
        };
    }

    if (isLoadingDock) {
        return <EventProgressBar text="Dock is being placed..." />
    }

    if (isLoadingMove) {
        return <EventProgressBar text="Soliders are moving to the new position..." />
    }

    return (
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
                        {myDockPositions && (100 * (myDockPositions.length + 1))} 💰 + {myDockPositions && (1500 * (myDockPositions.length + 1))} 🪵 ,
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
                            onClick={() => handleBackMap()}
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
    );
}