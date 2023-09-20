import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const ArmyAttackDrawer = () => {
  const { components, systemCalls } = useMUD();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();
  const { setMyArmyConfig,
    myArmyConfig,
    setEnemyArmyConfig,
    enemyArmyConfig,
    setIsAttackStage,
    attackFromArmyPositionToArmy,
    attackToArmyPositionToArmy } = useAttack();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAttackLater = () => {
    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  const handleAttack = async () => {
    const attackFromArmyId = [...findIDFromPosition(
      attackFromArmyPositionToArmy,
      components.Position,
    )];

    const attackToArmyId = [...findIDFromPosition(
      attackToArmyPositionToArmy,
      components.Position,
    )];

    if (attackFromArmyId.length != 1 || attackToArmyId.length != 1) {
      setErrorMessage("An error occurred while trying to attack to army.")
      setErrorTitle("Army Attack Error")
      setShowError(true)
      setIsLoading(false)
    }

    setIsLoading(true)
    const tx = await systemCalls.attackToArmy(attackFromArmyId[0] as string, attackToArmyId[0] as string, 1)

    if (tx == null) {
      setErrorMessage("An error occurred while attacking to army.")
      setErrorTitle("Army Attack Error")
      setShowError(true)
      setIsLoading(false)
    }

    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-toggle", "");
    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-target", "");

    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
    setIsLoading(false)
  };

  return (
    <>
      {isLoading && <EventProgressBar text={"Armies are fighting..."} />}
      <div
        className="offcanvas offcanvas-bottom attack-drawer"
        data-bs-keyboard="false"
        data-bs-backdrop="false"
        id="armyAttackDrawer"
        aria-labelledby="armyAttackDrawerLabel"
      >
        <ArmyAttackModalHeader headerText={"War - Army Information"} />
        <div className="offcanvas-body small">
          <div className="row">
            <ArmyAttackModalCard
              numSwordsman={myArmyConfig && myArmyConfig.myArmyConfig.numSwordsman}
              numArcher={myArmyConfig && myArmyConfig.myArmyConfig.numArcher}
              numCavalry={myArmyConfig && myArmyConfig.myArmyConfig.numCavalry}
              title={"My Army"}
              titleBg={"success"} />
            < ArmyAttackModalCard
              numSwordsman={enemyArmyConfig && enemyArmyConfig.armyConfig.numSwordsman}
              numArcher={enemyArmyConfig && enemyArmyConfig.armyConfig.numArcher}
              numCavalry={enemyArmyConfig && enemyArmyConfig.armyConfig.numCavalry}
              title={"Enemy Army"}
              titleBg={"danger"} />
          </div>
        </div>
        <div className="d-flex justify-content-evenly">
          <Button
            colorScheme="whatsapp"
            border="solid"
            textColor="dark"
            data-bs-dismiss="offcanvas"
            onClick={handleAttack}>
            Attack to the Army
          </Button>
          <Button
            colorScheme="red"
            border="solid"
            textColor="dark"
            data-bs-dismiss="offcanvas"
            onClick={handleAttackLater}>
            Wait and Attack Later
          </Button>
        </div>
      </div>
    </>
  );
}

const ArmyAttackModalHeader = ({ headerText }: { headerText: string }) => {
  return (
    <h5 className="offcanvas-title text-center" id="armyAttackDrawerLabel">
      {headerText}
    </h5>
  )
}

const ArmyAttackModalCard = ({ title, titleBg, numSwordsman, numArcher, numCavalry }: {
  title: string,
  titleBg: string,
  numSwordsman: number,
  numArcher: number,
  numCavalry: number
}) => {
  return (
    <div className="col">
      <h1 className={`text-center bg-${titleBg} p-2`}>
        {title}
      </h1>
      <ArmyAttackModalCardRow numSoldier={numSwordsman} soliderName={"Swordsman"} />
      <ArmyAttackModalCardRow numSoldier={numArcher} soliderName={"Archer"} />
      <ArmyAttackModalCardRow numSoldier={numCavalry} soliderName={"Cavalry"} />
    </div>
  )
}

const ArmyAttackModalCardRow = ({ numSoldier, soliderName }: { numSoldier: number, soliderName: string }) => {
  return (
    <div className="row text-center mt-2">
      <p>
        {soliderName && soliderName}: {numSoldier && numSoldier}
      </p>
    </div>
  )
}