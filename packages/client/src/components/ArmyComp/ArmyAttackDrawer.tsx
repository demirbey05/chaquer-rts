import { Button } from "@chakra-ui/react";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";

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
      return
    }

    const tx = await systemCalls.attackToArmy(attackFromArmyId[0] as string, attackToArmyId[0] as string, 1)

    if (tx == null) {
      setErrorMessage("An error occurred while trying to attack to army.")
      setErrorTitle("Army Attack Error")
      setShowError(true)
      return
    }

    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-toggle", "");
    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-target", "");

    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  const armyAttackOffCanvasDivStyles: any = {
    width: "500px",
    left: "0",
    right: "0",
    margin: "auto",
    bottom: "25px",
    padding: "10px",
    backgroundColor: "rgb(148, 163, 184, 0.5)"
  }

  return (
    <div
      className="offcanvas offcanvas-bottom rounded-4 font-bold text-white"
      data-bs-keyboard="false"
      data-bs-backdrop="false"
      style={armyAttackOffCanvasDivStyles}
      tabIndex={-1}
      id="armyAttackDrawer"
      aria-labelledby="armyAttackDrawerLabel"
    >
      <ArmyAttackModalHeader headerText={"War - Army Information"} />
      <div className="offcanvas-body small">
        <div className="row">
          <ArmyAttackModalCard
            numSwordsman={myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
            numArcher={myArmyConfig && myArmyConfig.armyConfig.numArcher}
            numCavalry={myArmyConfig && myArmyConfig.armyConfig.numCavalry}
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
      <div className="d-flex justify-content-center">
        <div className="flex-column align-items-center">
          <Button
            colorScheme="whatsapp"
            border="solid"
            textColor="dark"
            data-bs-dismiss="offcanvas"
            onClick={handleAttack}
            className="mr-2"
          >
            Attack to the Enemy
          </Button>
          <Button
            colorScheme="red"
            border="solid"
            textColor="dark"
            data-bs-dismiss="offcanvas"
            onClick={handleAttackLater}
            className="ml-2">
            Wait and Attack Later
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ArmyAttackModalHeaderPropTypes {
  headerText: string
};

const ArmyAttackModalHeader = (props: ArmyAttackModalHeaderPropTypes) => {
  return (
    <h5 className="offcanvas-title text-center" id="armyAttackDrawerLabel">
      {props.headerText}
    </h5>
  )
}

interface ArmyAttackModalCardPropTypes {
  title: string,
  titleBg: string,
  numSwordsman: number,
  numArcher: number,
  numCavalry: number
};

const ArmyAttackModalCard = (props: ArmyAttackModalCardPropTypes) => {
  return (
    <div className="col-6">
      <h1 className={`text-center bg-${props.titleBg}  text-white p-2`}>
        {props.title}
      </h1>
      <ArmyAttackModalCardRow numSolider={props.numSwordsman} soliderName={"Swordsman"} />
      <ArmyAttackModalCardRow numSolider={props.numArcher} soliderName={"Archer"} />
      <ArmyAttackModalCardRow numSolider={props.numCavalry} soliderName={"Cavalry"} />
    </div>
  )
}

interface ArmyAttackModalCardRowPropTypes {
  numSolider: number,
  soliderName: string
}

const ArmyAttackModalCardRow = (props: ArmyAttackModalCardRowPropTypes) => {
  return (
    <div className="row">
      <div className="row text-center mt-2">
        <p>
          {props.soliderName && props.soliderName}: {props.numSolider && props.numSolider}
        </p>
      </div>
    </div>
  )

}