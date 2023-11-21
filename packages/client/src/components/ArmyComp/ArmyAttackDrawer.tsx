import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { useGame } from "../../context/GameContext";
import battleSoundEffect from '../../sounds/soundEffects/battle-effect.mp3'

export const ArmyAttackDrawer = () => {
  const { components, systemCalls } = useMUD();
  const { gameID } = useGame();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();
  const { setMyArmyConfig,
    myArmyConfig,
    setEnemyArmyConfig,
    enemyArmyConfig,
    setIsAttackStage,
    setAttackFromArmyPositionToArmy,
    setAttackToArmyPositionToArmy,
    attackToArmyPositionToArmy,
    attackFromArmyPositionToArmy } = useAttack();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAttackLater = () => {
    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
    setAttackFromArmyPositionToArmy(undefined);
    setAttackToArmyPositionToArmy(undefined);
  };

  const handleAttack = async () => {
    const attackFromArmyId = [...getIDFromPosition(
      attackFromArmyPositionToArmy,
      components.Position,
      gameID
    )];

    const attackToArmyId = [...getIDFromPosition(
      attackToArmyPositionToArmy,
      components.Position,
      gameID
    )];

    if (attackFromArmyId.length != 1 || attackToArmyId.length != 1) {
      setErrorMessage("An error occurred while trying to attack to army.")
      setErrorTitle("Army Attack Error")
      setShowError(true)
      return
    }

    setIsLoading(true);

    const audio = new Audio(battleSoundEffect);
    audio.volume = 0.4;
    audio.play();

    const tx = await systemCalls.attackToArmy(attackFromArmyId[0] as string, attackToArmyId[0] as string, gameID);

    if (tx === null) {
      setErrorMessage("An error occurred while attacking to army.");
      setErrorTitle("Army Attack Error");
      setShowError(true);
    } else {
      const isTask = localStorage.getItem("attackCaptureTask")
      !isTask && localStorage.setItem("attackCaptureTask", "true")
      window.dispatchEvent(new Event('localDataStorage'));
    }

    setIsLoading(false);

    const element = document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`);
    if (element) {
      element.removeAttribute("data-bs-toggle");
      element.removeAttribute("data-bs-target");
    }

    setIsAttackStage(false);
    setAttackToArmyPositionToArmy(undefined);
    setAttackFromArmyPositionToArmy(undefined);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  if (isLoading) {
    return <EventProgressBar text={"Armies are fighting..."} />
  }

  return (
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