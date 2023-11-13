import { useState } from "react";
import { Button } from "@chakra-ui/react";
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

  const userValid = usePlayerIsValid(gameID, userWallet);

  const [isLoading, setIsLoading] = useState<boolean>(false)

  /*useBeforeUnload(
    useCallback((e) => {
      const handleExit = async () => {
        await systemCalls.exitGame(gameID)
      }
      handleExit();
    }, [])
  );*/

  const handleClick = async () => {
    setIsLoading(true)
    const tx = await systemCalls.settleCastle(tempCastle.x, tempCastle.y, gameID)
    if (tx === null) {
      setErrorMessage("An error occurred during castle settlement.");
      setErrorTitle("Castle Settlement Error");
      setShowError(true);
    } else {
      var myModalEl = document.getElementById('castleSettleModal');
      var modal = bootstrap.Modal.getInstance(myModalEl)
      modal.hide();
      setIsCastleSettled(true);
    }
    setIsLoading(false)
  };

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
                isLoading={isLoading}
                loadingText={"Settling"}
                border="solid"
                textColor="dark"
                isDisabled={!(userValid && userValid === true)}
                onClick={() => handleClick()}
              >
                Settle Castle
              </Button>
              <Button
                colorScheme="red"
                isDisabled={isLoading}
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
