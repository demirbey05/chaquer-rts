import { useRef, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { Entity } from "@latticexyz/recs";
import { useMUD } from "../../context/MUDContext";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { usePlayer } from "../../context/PlayerContext";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { useMyDockPositions } from "../../hooks/SeaHooks/useMyDockPositions";
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { useNumberOfWood } from "../../hooks/ResourceHooks/useNumberOfResource";
import { useGame } from "../../context/GameContext";
import creditIcon from '../../images/resourceAssets/credit_icon.png'
import woodIcon from '../../images/resourceAssets/wood_icon.png'
import armyMoveSoundEffect from "../../sounds/soundEffects/army-move-effect.mp3"
import buildSoundEffect from '../../sounds/soundEffects/build-effect.mp3'

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

    const numberOfWood = useNumberOfWood()

    useEffect(() => {
        if (myDockPositions && myCredit) {
            if (Number(getNumberFromBigInt(myCredit)) >= (100 * (myDockPositions.length + 1)) && numberOfWood >= (1500 * (myDockPositions.length + 1))) {
                setIsDisabled(false)
            }
            else {
                setIsDisabled(true)
            }
        }
    }, [myDockPositions, myCredit, numberOfWood])

    const handleBackMap = () => {
        setIsArmyMoveStage(false)
        setDockSettleStage(false);
        setArmyPositionToSettleDock(undefined);
        setDockPosition(undefined);
    }

    const handleSettle = async () => {
        const movingArmyIdMap = getIDFromPosition(
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
            const isTask = localStorage.getItem("dockSettlementTask")
            !isTask && localStorage.setItem("dockSettlementTask", "true")

            const audio = new Audio(fleetSettleSoundEffect);
            audio.volume = 0.2;
            audio.play();

            setDockSettleStage(false);
            setDockPosition(undefined);
        }

        setIsLoadingDock(false)
        targetDiv?.classList.remove("animate-border-army-move");
    };

    const handleMove = async () => {
        const movingArmyIdMap = getIDFromPosition(
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

            const tx = await systemCalls.moveArmy(movingArmyId.current, dockPosition.x, dockPosition.y, gameID)

            if (tx) {
                document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.innerHTML = "";
                document.getElementById(`${armyPositionToSettleDock.y},${armyPositionToSettleDock.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";

                const audio = new Audio(buildSoundEffect);
                audio.volume = 0.4;
                audio.play();

                const isTask = localStorage.getItem("armyMovementTask")
                !isTask && localStorage.setItem("armyMovementTask", "true")
            } else {
                setErrorMessage("You need 30 food + 30 diomand to move your army.")
                setErrorTitle("Army Move Warning")
                setShowError(true)
            }

            setIsLoadingMove(false)
            targetDiv?.classList.remove("animate-border-army-move");
            setDockSettleStage(false);
            setIsArmyMoveStage(false)
            setArmyPositionToSettleDock(undefined);
            setDockPosition(undefined);
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
                    <div className="modal-body text-center font-bold">
                        <p>{"You are going to settle a dock ⚓."}</p>
                        <p className="d-flex align-items-center justify-content-center">
                            <span className="me-2">Price of this dock :</span>
                            {myDockPositions && (100 * (myDockPositions.length + 1))}
                            <img className="ms-2" src={creditIcon} width={"20px"} height={"20px"} alt="credit-icon" />
                            <span className="ms-2 me-2">+</span>
                            {myDockPositions && (1500 * (myDockPositions.length + 1))}
                            <img className="ms-2" src={woodIcon} width={"20px"} height={"20px"} alt="wood-icon" />
                        </p>
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