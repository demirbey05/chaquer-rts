import { useTerrain } from "../../context/TerrainContext";
import { useMUD } from "../../MUDContext";
import { Button, NumberInput, NumberInputField } from "@chakra-ui/react";
import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { useState, useEffect } from "react";
import { getErrorLog } from "../../utils/getErrorLog";
import { useArmy } from "../../context/ArmyContext";

function ArmySettleModal() {
  const { abiCoder, provider } = useTerrain();
  const { armyPosition, setIsArmyStage, setIsArmySettled } = useArmy();
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
      parseInt(swordsmanCount) +
      parseInt(archerCount) +
      parseInt(cavalryCount) <=
      100 &&
      parseInt(swordsmanCount) +
      parseInt(archerCount) +
      parseInt(cavalryCount) >
      0
    ) {
      setIsDisabled(false);
    } else {
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
    if(tx){
      setIsArmySettled(true);
      setIsArmyStage(false);
    }
    
};

  return (
    <>
      <div
        className="modal fade"
        id="armySettleModal"
        data-bs-backdrop="static"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Army Settlement
              </h1>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row border-bottom">
                  <p>
                    Please determine the number of warriors that will hold in
                    the army. You can deploy maximum 100 army in the total.
                  </p>
                </div>
                <div className="row mt-2">
                  <div className="col align-items-center">
                    <div className="row justify-content-center">
                      <img
                        src={swordsmanImg}
                        style={{ height: "100px", width: "75px" }}
                      />
                    </div>
                    <div className="row justify-content-center text-center border-1 mt-2">
                      <p>Swordsman</p>
                    </div>
                    <div className="row justify-content-center mt-2">
                      <NumberInput min={0}>
                        <NumberInputField
                          onChange={(e: any) => setSwordsmanCount(e.target.value)}
                          onClick={(e: any) => e.target.select()}
                          maxLength={3}
                        />
                      </NumberInput>
                    </div>
                  </div>
                  <div className="col align-items-center">
                    <div className="row justify-content-center">
                      <img
                        src={archerImg}
                        style={{ height: "100px", width: "75px" }}
                      />
                    </div>
                    <div className="row justify-content-center text-center border-1 mt-2">
                      <p>Archer</p>
                    </div>
                    <div className="row justify-content-center mt-2">
                      <NumberInput min={0}>
                        <NumberInputField
                          onChange={(e: any) => setArcherCount(e.target.value)}
                          onClick={(e: any) => e.target.select()}
                          maxLength={3}
                        />
                      </NumberInput>
                    </div>
                  </div>
                  <div className="col align-items-center">
                    <div className="row justify-content-center">
                      <img
                        src={cavalryImg}
                        style={{ height: "100px", width: "100px" }}
                      />
                    </div>
                    <div className="row justify-content-center text-center border-1 mt-2">
                      <p>Cavalry</p>
                    </div>
                    <div className="row justify-content-center mt-2">
                      <NumberInput min={0}>
                        <NumberInputField
                          onChange={(e: any) => setCavalryCount(e.target.value)}
                          onClick={(e: any) => e.target.select()}
                          maxLength={3}
                        />
                      </NumberInput>
                    </div>
                  </div>
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

export default ArmySettleModal;
