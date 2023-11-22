import archerImg from "../../images/armyAssets/archer.png";
import cavalryImg from "../../images/armyAssets/cavalry.png";
import swordsmanImg from "../../images/armyAssets/swordsman.png";
import { useMUD } from "../../context/MUDContext";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useError } from "../../context/ErrorContext";
import { useGame } from "../../context/GameContext";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { useFleet } from "../../context/FleetContext";
import { useMyFleetPositions } from "../../hooks/SeaHooks/useMyFleetPositions";
import { usePlayer } from "../../context/PlayerContext";
import { getMyFleetConfigByPosition } from "../../utils/helperFunctions/SeaFunctions/getFleetConfigByPosition";
import { useMyArmy } from "../../hooks/ArmyHooks/useMyArmy";
import { getMyArmyConfigByPosition } from "../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";

export const FleetLoadModal = () => {
  const { systemCalls, components } = useMUD();
  const { gameID } = useGame();
  const { userWallet } = usePlayer();
  const { setIsFleetLoadStage, setTargetLoadFleetPosition, targetLoadFleetPosition, loadArmyPosition, setLoadArmyPosition } = useFleet()
  const { setErrorMessage, setErrorTitle, setShowError } = useError();

  const [swordsmanCount, setSwordsmanCount] = useState<string>("");
  const [archerCount, setArcherCount] = useState<string>("");
  const [cavalryCount, setCavalryCount] = useState<string>("");

  const [maxCapacity, setMaxCapacity] = useState<number>(0)
  const [fleetConfig, setFleetConfig] = useState<any>();
  const [armyConfig, setArmyConfig] = useState<any>()

  const [isDisabled, setIsDisabled] = useState(true);
  const [armyCheck, setArmyCheck] = useState<boolean>(false)
  const [totalSizeCheck, setTotalSizeCheck] = useState<boolean>(false)
  const [warningMessage, setWarningMessage] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const myFleets = useMyFleetPositions(userWallet, gameID)
  const myArmies = useMyArmy(userWallet, gameID)

  useEffect(() => {
    setIsDisabled(!(armyCheck && totalSizeCheck))
  }, [armyCheck, totalSizeCheck])

  useEffect(() => {
    if (armyConfig) {
      if (swordsmanCount.length + archerCount.length + cavalryCount.length === 0) {
        setArmyCheck(false)
      }
      else if (Number(swordsmanCount) > armyConfig.numSwordsman) {
        setArmyCheck(false)
      } else if (Number(archerCount) > armyConfig.numArcher) {
        setArmyCheck(false)
      } else if (Number(cavalryCount) > armyConfig.numCavalry) {
        setArmyCheck(false)
      } else {
        setArmyCheck(true)
      }
    }
  }, [armyConfig, swordsmanCount, archerCount, cavalryCount])

  useEffect(() => {
    if (armyConfig && fleetConfig) {
      const maxLoad = fleetConfig.numSmall + fleetConfig.numMedium * 2 + fleetConfig.numBig * 3;
      const armyTotal = Number(swordsmanCount) + Number(archerCount) + Number(cavalryCount);

      if (maxLoad >= armyTotal) {
        setTotalSizeCheck(true)
      } else {
        setTotalSizeCheck(false)
      }
    }
  }, [armyConfig, fleetConfig, swordsmanCount, archerCount, cavalryCount])

  useEffect(() => {
    if (loadArmyPosition && myArmies) {
      if (getMyArmyConfigByPosition({ x: loadArmyPosition.x, y: loadArmyPosition.y }, myArmies)) {
        const config = getMyArmyConfigByPosition({ x: loadArmyPosition.x, y: loadArmyPosition.y }, myArmies).myArmyConfig
        setArmyConfig(config)
      }
    } else {
      setArmyConfig(undefined)
    }
  }, [loadArmyPosition])

  useEffect(() => {
    if (targetLoadFleetPosition && myFleets) {
      if (getMyFleetConfigByPosition({ x: targetLoadFleetPosition.x, y: targetLoadFleetPosition.y }, myFleets)) {
        const config = getMyFleetConfigByPosition({ x: targetLoadFleetPosition.x, y: targetLoadFleetPosition.y }, myFleets).myFleetConfig
        const max = config.numSmall + config.numMedium * 2 + config.numBig * 3;
        setMaxCapacity(max)
        setFleetConfig(config)
      }
    } else {
      setFleetConfig(undefined)
      setMaxCapacity(0)
    }
  }, [targetLoadFleetPosition])

  const handleBackMap = () => {
    setIsFleetLoadStage(false)
  }

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
      setSwordsmanCount("0");
    }

    if ((document.getElementById('Cavalry') as HTMLInputElement).value === "") {
      setCavalryCount("0");
    }

    if ((document.getElementById('Archer') as HTMLInputElement).value === "") {
      setArcherCount("0");
    }

    const tx = await systemCalls.loadFleet(
      fleetID[0],
      armyID[0],
      Number(swordsmanCount),
      Number(archerCount),
      Number(cavalryCount),
      gameID
    );

    if (tx) {
      setSwordsmanCount("");
      setArcherCount("");
      setCavalryCount("");

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
              {
                warningMessage.length > 0 &&
                <div className="row mt-2 text-warning">
                  {warningMessage}
                </div>
              }
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
              <div className="row mt-3 ">
                <ArmyConfigInfo armyConfig={armyConfig} capacity={maxCapacity} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Button
              colorScheme="whatsapp"
              border="solid"
              textColor="dark"
              data-bs-dismiss="modal"
              isDisabled={isDisabled}
              onClick={() => handleClick()}
            >
              Load Fleet
            </Button>
            <Button
              colorScheme="red"
              border="solid"
              textColor="dark"
              onClick={() => handleBackMap()}
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
  setSoliderCount: React.Dispatch<React.SetStateAction<string>>
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

const ArmyConfigInfo = ({ armyConfig, capacity }: any) => {
  return (
    <div className="col text-center">
      <div className="col text-2xl w-100 border-bottom p-2 mb-2">
        Load Info
      </div>
      <div className="col text-info p-1">
        Swordsman : {armyConfig ? armyConfig.numSwordsman : 0}
      </div>
      <div className="col text-info p-1">
        Archer : {armyConfig ? armyConfig.numArcher : 0}
      </div>
      <div className="col text-info p-1">
        Cavalry : {armyConfig ? armyConfig.numCavalry : 0}
      </div>
      <div className="col text-success p-2">
        Fleet Solider Capacity : {capacity}
      </div>
    </div>
  )
}