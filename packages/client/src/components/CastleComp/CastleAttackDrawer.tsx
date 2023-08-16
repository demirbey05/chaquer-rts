import { Button } from "@chakra-ui/react";
import { findIDFromPosition } from "../../utils/findIDFromPosition";
import { useMUD } from "../../MUDContext";
import { useAttack } from "../../context/AttackContext";
import { findCastleCloseArmies } from "../../utils/findCastleCloseArmies";
import { useEffect, useState } from "react";

export const CastleAttackDrawer = () => {
  const { components, systemCalls } = useMUD();
  const { setMyArmyConfig,
    setEnemyArmyConfig,
    myArmyConfig,
    attackToArmyPositionToCastle,
    attackFromArmyPositionToCastle,
    setIsAttackStage } = useAttack();
  const [castleArmy, setCastleArmy] = useState<any>();

  const handleAttackLater = () => {
    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  useEffect(() => {
    if (attackToArmyPositionToCastle) {
      const castleId = [...findIDFromPosition(
        attackToArmyPositionToCastle,
        components.Position,
      )];

      setCastleArmy(findCastleCloseArmies(castleId[0], components.Position, components.CastleOwnable, components.ArmyOwnable, components.ArmyConfig))
    }
  }, [attackToArmyPositionToCastle])

  const handleAttack = async () => {
    const attackFromArmyId = [...findIDFromPosition(
      attackFromArmyPositionToCastle,
      components.Position,
    )];

    const attackToCastleId = [...findIDFromPosition(
      attackToArmyPositionToCastle,
      components.Position,
    )];

    findCastleCloseArmies(attackToCastleId[0], components.Position, components.CastleOwnable, components.ArmyOwnable, components.ArmyConfig)
    if (attackFromArmyId.length != 1 || attackToCastleId.length != 1) {
      console.log("attackFromArmyID or attackToCastleID lengths are greater than 1")
      return
    }
    const tx = await systemCalls.castleCapture(attackFromArmyId[0], attackToCastleId[0])
    if (tx == null) {
      console.log("handleAttack encounter an error!. In Castle Capturing.")
      return
    }

    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  const castleAttackOffCanvasDivStyle: any = {
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
      style={castleAttackOffCanvasDivStyle}
      tabIndex={-1}
      id="castleAttackDrawer"
      aria-labelledby="castleAttackDrawerLabel"
    >
      <CastleAttackModalHeader />
      <div className="offcanvas-body small">
        <div className="row">
          <CastleAttackModalArmyCard title={"My Army"} titleBg={"success"}
            numSwordsman={myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
            numArcher={myArmyConfig && myArmyConfig.armyConfig.numArcher}
            numCavalry={myArmyConfig && myArmyConfig.armyConfig.numCavalry} />
          <CastleAttackModalArmyCard title={"Enemy Army"} titleBg={"danger"}
            numSwordsman={castleArmy && castleArmy.numSwordsman}
            numArcher={castleArmy && castleArmy.numArcher}
            numCavalry={castleArmy && castleArmy.numCavalry} />
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
            className="ml-2"
          >
            Wait and Attack Later
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CastleAttackModalArmyCardPropTypes {
  title: string,
  titleBg: string,
  numSwordsman: number,
  numArcher: number,
  numCavalry: number
}

const CastleAttackModalArmyCard = (props: CastleAttackModalArmyCardPropTypes) => {
  return (
    <>
      <div className="col-6" style={{ overflow: "hidden" }}>
        <h1 className={`text-center text-white p-2 bg-${props.titleBg}`}>
          {props.title}
        </h1>
        <CastleAttackModalArmyCardRow soliderNum={props.numSwordsman} soliderName={"Swordsman"} />
        <CastleAttackModalArmyCardRow soliderNum={props.numArcher} soliderName={"Archer"} />
        <CastleAttackModalArmyCardRow soliderNum={props.numCavalry} soliderName={"Cavalry"} />
      </div>
    </>
  )
}

interface CastleAttackModalArmyCardRowPropTypes {
  soliderNum: number,
  soliderName: string
}

const CastleAttackModalArmyCardRow = (props: CastleAttackModalArmyCardRowPropTypes) => {
  return (
    <div className="row">
      <div className="row text-center mt-2">
        <p>
          {props.soliderName && props.soliderName}: {props.soliderNum && props.soliderNum}
        </p>
      </div>
    </div>
  )
}

const CastleAttackModalHeader = () => {
  return (
    <h5 className="offcanvas-title text-center text-white" id="castleAttackDrawerLabel">
      War - Army Information
    </h5>
  )
}