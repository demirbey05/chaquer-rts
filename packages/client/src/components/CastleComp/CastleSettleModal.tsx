import { useEffect, useState, useCallback } from "react";
import { useBeforeUnload } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useCastle } from "../../context/CastleContext";
import { useError } from "../../context/ErrorContext";
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from "../../context/GameContext";
import { usePlayerIsValid } from "../../hooks/IdentityHooks/usePlayerIsValid";

export const CastleSettleModal = () => {
  const { systemCalls } = useMUD();
  const { isCastleSettled, tempCastle, setIsCastleSettled } = useCastle();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();
  const { userWallet } = usePlayer();
  const { gameID } = useGame();

  const [isLoadingJoin, setIsLoadingJoin] = useState<boolean>(false);

  const userValid = usePlayerIsValid(gameID, userWallet);

  useBeforeUnload(
    useCallback((e) => {
      const handleExit = async () => {
        await systemCalls.exitGame(gameID)
      }
      handleExit();
    }, [])
  );

  useEffect(() => {
    if (!(userValid && userValid === true)) {
      setIsLoadingJoin(true)
    }
    else {
      setIsLoadingJoin(false)
    }
  }, [userValid])

  const handleClick = async () => {
    setIsCastleSettled(true);
    try {
      await systemCalls.settleCastle(tempCastle.x, tempCastle.y, gameID)
    } catch (error) {
      setErrorMessage("An error occurred during castle settlement.");
      setErrorTitle("Castle Settlement Error");
      setShowError(true);
    }
  };

  if (isLoadingJoin) {
    return <EventProgressBar text="Joining to the game..." />
  }

  if (!isCastleSettled) {
    return (
      <div
        className="modal fade"
        id="castleSettleModal"
        data-bs-backdrop="static"
        aria-labelledby="castleSettleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header justify-center">
              <h1 className="modal-title text-2xl" id="castleSettleModalLabel">
                Castle Settlement
              </h1>
            </div>
            <div className="modal-body">
              You are going to settle your Castle, are you sure?
            </div>
            <div className="modal-footer">
              <Button
                colorScheme="whatsapp"
                border="solid"
                textColor="dark"
                data-bs-dismiss="modal"
                isDisabled={!(userValid && userValid === true)}
                onClick={() => handleClick()}
              >
                Settle Castle
              </Button>
              <Button
                colorScheme="red"
                border="solid"
                textColor="dark"
                data-bs-dismiss="modal"
              >
                Back to Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
