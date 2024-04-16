import archerImg from "../../images/armyAssets/custom/archer.png";
import cavalryImg from "../../images/armyAssets/custom/cavalry.png";
import swordsmanImg from "../../images/armyAssets/custom/swordsman.png";
import artilleryImg from '../../images/armyAssets/artillery.png'
import armySettleEffect from '../../sounds/soundEffects/army-deploy-effect.mp3'
import { useMUD } from "../../context/MUDContext";
import { Button, Alert, AlertIcon, AlertTitle, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { usePlayer } from "../../context/PlayerContext";
import { useCastle } from "../../context/CastleContext";
import { useGame } from "../../context/GameContext";
import { useArmyPrices } from '../../hooks/EconomyHooks/useArmyPrices';
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";

export const ArmySettleModal = () => {
  const { systemCalls, components } = useMUD();
  const { userWallet } = usePlayer();
  const { armyPosition, setIsArmySettleStage, setIsArmyUpdateStage } = useArmy();
  const { setErrorMessage, setErrorTitle, setShowError } = useError();
  const { castlePosition } = useCastle();
  const { gameID } = useGame();

  const [swordsmanCount, setSwordsmanCount] = useState<string>("");
  const [archerCount, setArcherCount] = useState<string>("");
  const [cavalryCount, setCavalryCount] = useState<string>("");

  const [artilleryCount, setArtilleryCount] = useState<string>("")

  const [isDisabled, setIsDisabled] = useState(true);
  const [enoughCredit, setEnoughCredit] = useState(true);
  const [totalCharge, setTotalCharge] = useState<number>(0);

  const [isDisabledArtillery, setIsDisabledArtillery] = useState(true);
  const [enoughCreditArtillery, setEnoughCreditArtillery] = useState(true);
  const [totalChargeArtillery, setTotalChargeArtillery] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingArtillery, setIsLoadingArtillery] = useState<boolean>(false);

  const armyPrices = useArmyPrices();
  const myCredit = useCredit(gameID, userWallet);

  useEffect(() => {
    if (Number.isNaN(parseInt(artilleryCount))) {
      setArtilleryCount("0")
    }

    if (artilleryCount.length === 0 && Number(artilleryCount) === 0) {
      setIsDisabledArtillery(true);
      setEnoughCreditArtillery(true);
      return;
    }

    const ArtillaryCount = Number(artilleryCount);

    if (armyPrices) {
      const totalCharge = ArtillaryCount * 10

      if (ArtillaryCount <= 0 || ArtillaryCount > 30) {
        setIsDisabledArtillery(true);
        setTotalChargeArtillery(totalCharge);
      } else if (!armyPrices || !myCredit) {
        setIsDisabledArtillery(true);
      } else if (totalCharge > Number(getNumberFromBigInt(myCredit))) {
        setIsDisabledArtillery(true);
        setEnoughCreditArtillery(false);
        setTotalChargeArtillery(totalCharge);
      } else {
        setIsDisabledArtillery(false);
        setEnoughCreditArtillery(true);
      }
    }
  }, [artilleryCount, myCredit])

  useEffect(() => {
    if (Number.isNaN(parseInt(swordsmanCount))) {
      setSwordsmanCount("0")
    }

    if (Number.isNaN(parseInt(archerCount))) {
      setArcherCount("0")
    }

    if (Number.isNaN(parseInt(cavalryCount))) {
      setCavalryCount("0")
    }

    if (swordsmanCount.length === 0 &&
      archerCount.length === 0 &&
      cavalryCount.length === 0 ||
      Number(swordsmanCount) + Number(archerCount) + Number(cavalryCount) === 0) {
      setIsDisabled(true);
      setEnoughCredit(true);
      return;
    }

    const parsedSwordsmanCount = Number(swordsmanCount);
    const parsedArcherCount = Number(archerCount);
    const parsedCavalryCount = Number(cavalryCount);

    const totalTroops = parsedSwordsmanCount + parsedArcherCount + parsedCavalryCount;

    if (armyPrices) {
      const totalCharge =
        parsedSwordsmanCount * armyPrices.swordsmanPrice +
        parsedArcherCount * armyPrices.archerPrice +
        parsedCavalryCount * armyPrices.cavalryPrice;

      if (totalTroops <= 0 || totalTroops > 500) {
        setIsDisabled(true);
        setTotalCharge(totalCharge);
      } else if (!armyPrices || !myCredit) {
        setIsDisabled(true);
      } else if (totalCharge > Number(getNumberFromBigInt(myCredit))) {
        setIsDisabled(true);
        setEnoughCredit(false);
        setTotalCharge(totalCharge);
      } else {
        setIsDisabled(false);
        setEnoughCredit(true);
      }
    }
  }, [swordsmanCount, archerCount, cavalryCount, armyPrices, myCredit]);


  const handleArmySettlement = async () => {
    setIsArmySettleStage(false);
    setIsArmyUpdateStage(false)
    setIsLoading(true);

    var targetDiv = document.getElementById(`${armyPosition.y},${armyPosition.x}`);
    targetDiv?.classList.add("animate-border-settle");

    const castleID = [...getIDFromPosition(
      castlePosition,
      components.Position,
      gameID
    )];

    if (castleID.length != 1) {
      setErrorMessage("An error occurred while trying to settle an army.")
      setErrorTitle("Army Settle Error")
      setShowError(true)
      setIsLoading(false)
    }

    if ((document.getElementById('SwordsmanSettle') as HTMLInputElement).value === "") {
      setSwordsmanCount("0");
    }

    if ((document.getElementById('CavalrySettle') as HTMLInputElement).value === "") {
      setCavalryCount("0");
    }

    if ((document.getElementById('ArcherSettle') as HTMLInputElement).value === "") {
      setArcherCount("0");
    }

    const audio = new Audio(armySettleEffect);
    audio.volume = 0.2;
    audio.play();

    const tx = await systemCalls.settleArmy(
      armyPosition.x,
      armyPosition.y,
      Number(swordsmanCount),
      Number(archerCount),
      Number(cavalryCount),
      gameID,
      castleID.toString()
    );

    if (tx) {
      setSwordsmanCount('');
      setArcherCount('');
      setCavalryCount('');

      const isTask = localStorage.getItem("armySettlementTask")
      !isTask && localStorage.setItem("armySettlementTask", "true")
      window.dispatchEvent(new Event('localDataStorage'));
    } else {
      setErrorMessage("An error occurred during army settlement.");
      setErrorTitle("Army Settlement Error");
      setShowError(true);
    }

    setIsLoading(false);
    targetDiv?.classList.remove("animate-border-settle");
  };

  const handleArtillerySettlement = async () => {
    setIsArmySettleStage(false);
    setIsArmyUpdateStage(false)
    setIsLoadingArtillery(true);

    var targetDiv = document.getElementById(`${armyPosition.y},${armyPosition.x}`);
    targetDiv?.classList.add("animate-border-settle");

    const castleID = [...getIDFromPosition(
      castlePosition,
      components.Position,
      gameID
    )];

    if (castleID.length != 1) {
      setErrorMessage("An error occurred while trying to settle artillery.")
      setErrorTitle("Artillery Settle Error")
      setShowError(true)
      setIsLoadingArtillery(false)
    }

    if ((document.getElementById('ArtillerySettle') as HTMLInputElement).value === "") {
      setSwordsmanCount("0");
    }

    const audio = new Audio(armySettleEffect);
    audio.volume = 0.2;
    audio.play();

    const tx = await systemCalls.settleArtillery(
      armyPosition.x,
      armyPosition.y,
      gameID,
      Number(artilleryCount),
      castleID.toString()
    );

    if (tx) {
      setArtilleryCount('');
    } else {
      setErrorMessage("An error occurred during artillery settlement.");
      setErrorTitle("Artillery Settlement Error");
      setShowError(true);
    }

    setIsLoadingArtillery(false);
    targetDiv?.classList.remove("animate-border-settle");
  }

  if (isLoading) {
    return <EventProgressBar text="Army is moving to the map..." />
  }

  if (isLoadingArtillery) {
    return <EventProgressBar text="Artillery is moving to the map..." />
  }

  return (
    <div
      className="modal fade"
      id="armySettleModal"
      data-bs-backdrop="static"
      aria-labelledby="armySettleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white pt-3">
          <Tabs
            isFitted
            variant={"solid-rounded"}
          >
            <TabList ps={3} pe={3}>
              <Tab >Army Settlement</Tab>
              <Tab>Artillery Settlement</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <div className="modal-body">
                  <div className="container-fluid">
                    {
                      !enoughCredit &&
                      <Alert status='warning' color={"black"}>
                        <AlertIcon />
                        <AlertTitle>You have no enough credit, sell some resources! Total Charge: {totalCharge} 💰</AlertTitle>
                      </Alert>
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
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    colorScheme="whatsapp"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #33550F"}
                    data-bs-dismiss="modal"
                    isDisabled={isDisabled}
                    onClick={handleArmySettlement}
                  >
                    Settle Army
                  </Button>
                  <Button
                    colorScheme="red"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #7E2918"}
                    data-bs-dismiss="modal"
                  >
                    Back to Map
                  </Button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="modal-body">
                  <div className="container-fluid">
                    {
                      !enoughCreditArtillery &&
                      <Alert status='warning' color={"black"}>
                        <AlertIcon />
                        <AlertTitle>You have no enough credit, sell some resources! Total Charge: {totalChargeArtillery} 💰</AlertTitle>
                      </Alert>
                    }
                    <div className="row mt-2">
                      <ArmySettleInputBody imageSource={artilleryImg}
                        soldierName={"Artillery"}
                        setSoliderCount={setArtilleryCount}
                        imageHeight={"100px"}
                        imageWidth={"150px"} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    colorScheme="whatsapp"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #33550F"}
                    data-bs-dismiss="modal"
                    isDisabled={isDisabledArtillery}
                    onClick={handleArtillerySettlement}
                  >
                    Settle Artillery
                  </Button>
                  <Button
                    colorScheme="red"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #7E2918"}
                    data-bs-dismiss="modal"
                  >
                    Back to Map
                  </Button>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
          id={props.soldierName + "Settle"}
          onChange={(e: any) => props.setSoliderCount(e.target.value)}
          onClick={(e: any) => e.target.select()} />
      </div>
    </div>
  )
}