import { useMUD } from "../../MUDContext";
import { Entity } from "@latticexyz/recs";
import { useRef } from "react";
import { Button } from "@chakra-ui/react";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const DockSettleModal = () => {
    const { systemCalls, components } = useMUD();
    const movingArmyId = useRef<Entity>("0" as Entity);

    const { armyPositionToSettleDock, dockPosition, setDockPosition, setArmyPositionToSettleDock, setDockSettleStage } = useSea();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

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
                        <div className="modal-body">
                            You are going to settle a Dock, are you sure?
                        </div>
                        <div className="modal-footer">
                            <Button
                                colorScheme="linkedin"
                                border="solid"
                                textColor="dark"
                                data-bs-dismiss="modal"
                                onClick={() => handleMove()}
                            >
                                Just Move the Army
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