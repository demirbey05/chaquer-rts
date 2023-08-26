import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { useMUD } from "../../MUDContext";
import { Button, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useArmy } from "../../context/ArmyContext";
import { CustomToastMessage } from "../ErrorMonitoringComp/CustomToastMessage";
import { useError } from "../../context/ErrorContext";

export const ArmySettleModal = () => {
  const { armyPosition, setIsArmySettleStage, setIsArmySettled } = useArmy();
  const { setErrorMessage, setErrorTitle, setShowError } = useError();
  const { systemCalls } = useMUD();

  const [swordsmanCount, setSwordsmanCount] = useState<string>("");
  const [archerCount, setArcherCount] = useState<string>("");
  const [cavalryCount, setCavalryCount] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (
      (swordsmanCount && swordsmanCount.toString().length === 0) ||
      (archerCount && archerCount.toString().length === 0) ||
      (cavalryCount && cavalryCount.toString().length === 0)
    ) {
      setIsDisabled(true);
    }

    if (
      parseInt(swordsmanCount) + parseInt(archerCount) + parseInt(cavalryCount) <= 1500 &&
      parseInt(swordsmanCount) + parseInt(archerCount) + parseInt(cavalryCount) > 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    if (
      (parseInt(swordsmanCount) > 500 || parseInt(swordsmanCount) < 0) ||
      (parseInt(archerCount) > 500 || parseInt(archerCount) < 0) ||
      (parseInt(cavalryCount) > 500 || parseInt(cavalryCount) < 0)
    ) {
      setIsDisabled(true);
    }
  }, [swordsmanCount, archerCount, cavalryCount]);

  const handleClick = async () => {
    const tx = await systemCalls.settleArmy(
      armyPosition.x,
      armyPosition.y,
      parseInt(swordsmanCount),
      parseInt(archerCount),
      parseInt(cavalryCount),
      1
    );
    if (tx) {
      setIsArmySettled(true);
      setIsArmySettleStage(false);

      setSwordsmanCount('');
      setArcherCount('');
      setCavalryCount('');

      (document.getElementById('Swordsman') as HTMLInputElement).value = '';
      (document.getElementById('Cavalry') as HTMLInputElement).value = '';
      (document.getElementById('Archer') as HTMLInputElement).value = '';
    }
    else {
      setErrorMessage("An error occurred during army settlement!")
      setErrorTitle("Army Settlement Error")
      setShowError(true)
    }
  };

  return (
    <div
      className="modal fade"
      id="armySettleModal"
      data-bs-backdrop="static"
      aria-labelledby="armySettleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header justify-center">
            <Tooltip label="Please determine the number of warriors that will hold in
                  the army. You can deploy maximum 1500 army in the total and 500 for each type." placement="top-start" bg="blue.400" fontSize="md">
              <h1 className="modal-title text-2xl" id="armySettleModalLabel">
                Army Settlement
              </h1>
            </Tooltip>
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