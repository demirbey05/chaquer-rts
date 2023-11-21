import archerImg from "../../images/armyAssets/archer.png";
import cavalryImg from "../../images/armyAssets/cavalry.png";
import swordsmanImg from "../../images/armyAssets/swordsman.png";
import { useMUD } from "../../context/MUDContext";
import { Button, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { usePlayer } from "../../context/PlayerContext";
import { useCastle } from "../../context/CastleContext";
import { useGame } from "../../context/GameContext";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { useFleet } from "../../context/FleetContext";

export const FleetLoadModal = () => {
  const { systemCalls, components } = useMUD();
  const { gameID } = useGame();
  const { setIsFleetLoadStage, setTargetLoadFleetPosition, targetLoadFleetPosition, loadArmyPosition, setLoadArmyPosition } = useFleet()
  const { setErrorMessage, setErrorTitle, setShowError } = useError();

  const [swordsmanCount, setSwordsmanCount] = useState<number>(0);
  const [archerCount, setArcherCount] = useState<number>(0);
  const [cavalryCount, setCavalryCount] = useState<number>(0);

  const [isDisabled, setIsDisabled] = useState(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setIsFleetLoadStage(false);
    setIsLoading(true);

    var targetDiv = document.getElementById(`${targetLoadFleetPosition.y},${targetLoadFleetPosition.x}`);
    targetDiv?.classList.add("animate-border-settle");

    const fleetID = [...getIDFromPosition(
      targetLoadFleetPosition,
      components.Position,
      gameID
    )];

    const armyID = [...getIDFromPosition(
      loadArmyPosition,
      components.Position,
      gameID
    )];

    if (fleetID.length != 1 || armyID.length != 1) {
      setErrorMessage("An error occurred while trying to settle an army.")
      setErrorTitle("Army Settle Error")
      setShowError(true)
      setIsLoading(false)
    }

    if ((document.getElementById('Swordsman') as HTMLInputElement).value === "") {
      setSwordsmanCount(0);
    }

    if ((document.getElementById('Cavalry') as HTMLInputElement).value === "") {
      setCavalryCount(0);
    }

    if ((document.getElementById('Archer') as HTMLInputElement).value === "") {
      setArcherCount(0);
    }

    const tx = await systemCalls.loadFleet(
      fleetID[0],
      armyID[0],
      swordsmanCount,
      archerCount,
      cavalryCount,
      gameID
    );

    if (tx) {
      setSwordsmanCount(0);
      setArcherCount(0);
      setCavalryCount(0);

      const isTask = localStorage.getItem("fleetLoadTask")
      !isTask && localStorage.setItem("fleetLoadTask", "true")
      window.dispatchEvent(new Event('localDataStorage'));
    } else {
      setErrorMessage("An error occurred during fleet load.");
      setErrorTitle("Fleet Load Error");
      setShowError(true);
    }

    setTargetLoadFleetPosition({ x: -1, y: -1 })
    setLoadArmyPosition({ x: -1, y: -1 })
    setIsLoading(false);
    targetDiv?.classList.remove("animate-border-settle");
  };

  if (isLoading) {
    return <EventProgressBar text="Soldiers are getting to the fleet..." />
  }

  return (
    <div
      className="modal fade"
      id="fleetLoadModal"
      data-bs-backdrop="static"
      aria-labelledby="fleetLoadModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header justify-center">
            <h1 className="modal-title text-2xl" id="fleetLoadModalLabel">
              Fleet Load
            </h1>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row mt-2">
                <ArmySettleInputBody imageSource={swordsmanImg}
                  soldierName={"Swordsman"}
                  setSoliderCount={setSwordsmanCount}
                  imageHeight={"100px"}
                  imageWidth={"75px"} />
                <ArmySettleInputBody imageSource={archerImg}
                  soldierName={"Archer"}
                  setSoliderCount={setArcherCount}
                  imageHeight={"100px"}
                  imageWidth={"85px"} />
                <ArmySettleInputBody imageSource={cavalryImg}
                  soldierName={"Cavalry"}
                  setSoliderCount={setCavalryCount}
                  imageHeight={"100px"}
                  imageWidth={"125px"} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Button
              colorScheme="whatsapp"
              border="solid"
              textColor="dark"
              data-bs-dismiss="modal"
              onClick={() => handleClick()}
            >
              Load Fleet
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
}

interface ArmySettleInputBody {
  imageSource: string,
  imageHeight: string,
  imageWidth: string,
  soldierName: string,
  setSoliderCount: React.Dispatch<React.SetStateAction<number>>
}

const ArmySettleInputBody = (props: ArmySettleInputBody) => {
  return (
    <div className="col align-items-center">
      <div className="row justify-content-center">
        <img
          src={props.imageSource}
          style={{ height: props.imageHeight, width: props.imageWidth }}
        />
      </div>
      <div className="row justify-content-center text-center mt-2">
        <p>{props.soldierName}</p>
      </div>
      <div className="row justify-content-center mt-2">
        <input
          className="form-control w-75"
          type="number"
          id={props.soldierName}
          onChange={(e: any) => props.setSoliderCount(e.target.value)}
          onClick={(e: any) => e.target.select()} />
      </div>
    </div>
  )
}