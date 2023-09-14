import { useMUD } from "../../context/MUDContext";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useCastle } from "../../context/CastleContext";
import { useError } from "../../context/ErrorContext";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";

export const CastleSettleModal = () => {
  const {
    isCastleSettled,
    tempCastle,
    setCastle,
    setIsCastleSettled
  } = useCastle();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();
  const { systemCalls } = useMUD();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setIsLoading(true);
    setIsCastleSettled(true);
    try {
      const tx = !isCastleSettled &&
        (await systemCalls.settleCastle(tempCastle.x, tempCastle.y, 1));

      if (tx) {
        setCastle({ x: tempCastle.x, y: tempCastle.y });
      } else {
        setErrorMessage("An error occurred during castle settlement.");
        setErrorTitle("Castle Settlement Error");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred during castle settlement.");
      setErrorTitle("Castle Settlement Error");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
      {isLoading && <EventProgressBar text="Castle is being placed..." />}
    </>
  );
};
