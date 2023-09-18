import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { useMUD } from "../../context/MUDContext";
import { Button, Tooltip, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { usePlayer } from "../../context/PlayerContext";
import { useArmyPrices } from '../../hooks/EconomyHooks/useArmyPrices';
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useCastle } from "../../context/CastleContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const ArmySettleModal = () => {
  const { userWallet } = usePlayer();
  const { armyPosition, setIsArmySettleStage, setIsArmyUpdateStage } = useArmy();
  const { setErrorMessage, setErrorTitle, setShowError } = useError();
  const { systemCalls, components } = useMUD();
  const { castlePosition } = useCastle();

  const [swordsmanCount, setSwordsmanCount] = useState<string>("");
  const [archerCount, setArcherCount] = useState<string>("");
  const [cavalryCount, setCavalryCount] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [enoughCredit, setEnoughCredit] = useState(true);
  const [totalCharge, setTotalCharge] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const armyPrices = useArmyPrices(1);
  const myCredit = useCredit(1, userWallet);

  useEffect(() => {
    if (swordsmanCount.length === 0 && archerCount.length === 0 && cavalryCount.length === 0) {
      setIsDisabled(true);
      return;
    }

    const parsedSwordsmanCount = parseInt(swordsmanCount);
    const parsedArcherCount = parseInt(archerCount);
    const parsedCavalryCount = parseInt(cavalryCount);

    const totalTroops = parsedSwordsmanCount + parsedArcherCount + parsedCavalryCount;

    const totalCharge =
      parsedSwordsmanCount * Number(getNumberFromBigInt(armyPrices.priceSwordsman)) +
      parsedArcherCount * Number(getNumberFromBigInt(armyPrices.priceArcher)) +
      parsedCavalryCount * Number(getNumberFromBigInt(armyPrices.priceCavalry));

    if (totalTroops <= 0 || totalTroops > 500) {
      setIsDisabled(true);
      setTotalCharge(totalCharge);
    } else if (!armyPrices || !myCredit) {
      setIsDisabled(true);
      setEnoughCredit(false);
      setTotalCharge(totalCharge);
    } else {
      if (totalCharge > parseInt(getNumberFromBigInt(myCredit))) {
        setIsDisabled(true);
        setEnoughCredit(false);
        setTotalCharge(totalCharge);
      } else {
        setIsDisabled(false);
        setEnoughCredit(true);
      }
    }
  }, [swordsmanCount, archerCount, cavalryCount, armyPrices, myCredit]);


  const handleClick = async () => {
    setIsArmySettleStage(false);
    setIsArmyUpdateStage(false)
    setIsLoading(true);
    var targetDiv = document.getElementById(`${armyPosition.y},${armyPosition.x}`);
    targetDiv?.classList.add("animate-border-settle");

    const castleID = [...findIDFromPosition(
      castlePosition,
      components.Position,
    )];

    if (castleID.length != 1) {
      setErrorMessage("An error occurred while trying to settle an army.")
      setErrorTitle("Army Settle Error")
      setShowError(true)
      setIsLoading(false)
      return
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

    try {
      const tx = await systemCalls.settleArmy(
        armyPosition.x,
        armyPosition.y,
        Number(swordsmanCount),
        Number(archerCount),
        Number(cavalryCount),
        1,
        castleID.toString()
      );

      if (tx) {
        setSwordsmanCount('');
        setArcherCount('');
        setCavalryCount('');
        (document.getElementById('Swordsman') as HTMLInputElement).value = '';
        (document.getElementById('Cavalry') as HTMLInputElement).value = '';
        (document.getElementById('Archer') as HTMLInputElement).value = '';
      } else {
        setErrorMessage("You have no enough credit!");
        setErrorTitle("Army Settlement Error");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred during army settlement.");
      setErrorTitle("Army Settlement Error");
      setShowError(true);
    } finally {
      setIsLoading(false);
      targetDiv?.classList.remove("animate-border-settle");
    }
  };

  return (
    <>
      {isLoading && <EventProgressBar text="Army is moving to the map..." />}
      <div
        className="modal fade"
        id="armySettleModal"
        data-bs-backdrop="static"
        aria-labelledby="armySettleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header justify-center">
              <Tooltip label="Please determine the number of warriors that will hold in
                  the army. You can deploy maximum 500 soldiers in an army." placement="top-start" bg="blue.400" fontSize="md">
                <h1 className="modal-title text-2xl" id="armySettleModalLabel">
                  Army Settlement
                </h1>
              </Tooltip>
            </div>
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
                border="solid"
                textColor="dark"
                data-bs-dismiss="modal"
                isDisabled={isDisabled}
                onClick={() => handleClick()}
              >
                Settle Army
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
    </>

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