import { useEffect, useState } from "react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { Button } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";

export const CastleAttackDrawer = () => {
  const { components, systemCalls } = useMUD();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();
  const { setMyArmyConfig,
    setEnemyArmyConfig,
    myArmyConfig,
    attackToArmyPositionToCastle,
    attackFromArmyPositionToCastle,
    setIsAttackStage } = useAttack();

  const [castleArmy, setCastleArmy] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setErrorMessage("An error occurred while trying to attack to castle.")
      setErrorTitle("Castle Attack Error")
      setShowError(true)
      return
    }

    try {
      setIsLoading(true)
      console.log("Tx atıldı")
      await systemCalls.castleCapture(attackFromArmyId[0], attackToCastleId[0])
    } catch (error) {
      setErrorMessage("An error occurred while trying to attack to castle.")
      setErrorTitle("Castle Attack Error")
      setShowError(true)
    } finally {
      setIsAttackStage(false);
      setMyArmyConfig(undefined);
      setEnemyArmyConfig(undefined);
      setIsLoading(false)
    }
  };

  if (isLoading) {
    return <EventProgressBar text="Soliders are trying to capture the castle..." />
  }

  return (
    <div
      className="offcanvas offcanvas-bottom attack-drawer"
      data-bs-keyboard="false"
      data-bs-backdrop="false"
      id="castleAttackDrawer"
      aria-labelledby="castleAttackDrawerLabel"
    >
      <CastleAttackModalHeader />
      <div className="offcanvas-body small">
        <div className="row">
          <CastleAttackModalArmyCard title={"My Army"} titleBg={"success"}
            numSwordsman={myArmyConfig && myArmyConfig.myArmyConfig.numSwordsman}
            numArcher={myArmyConfig && myArmyConfig.myArmyConfig.numArcher}
            numCavalry={myArmyConfig && myArmyConfig.myArmyConfig.numCavalry} />
          <CastleAttackModalArmyCard title={"Enemy Army"} titleBg={"danger"}
            numSwordsman={castleArmy && castleArmy.numSwordsman}
            numArcher={castleArmy && castleArmy.numArcher}
            numCavalry={castleArmy && castleArmy.numCavalry} />
        </div>
      </div>
      <div className="d-flex justify-content-evenly">
        <Button
          colorScheme="whatsapp"
          border="solid"
          textColor="dark"
          data-bs-dismiss="offcanvas"
          onClick={handleAttack}
        >
          Capture the Castle
        </Button>
        <Button
          colorScheme="red"
          border="solid"
          textColor="dark"
          data-bs-dismiss="offcanvas"
          onClick={handleAttackLater}
        >
          Wait and Attack Later
        </Button>
      </div>
    </div>
  );
}

const CastleAttackModalArmyCard = ({ title, titleBg, numSwordsman, numArcher, numCavalry }: {
  title: string,
  titleBg: string,
  numSwordsman: number,
  numArcher: number,
  numCavalry: number
}) => {
  return (
    <div className="col">
      <h1 className={`text-center p-2 bg-${titleBg}`}>
        {title}
      </h1>
      <CastleAttackModalArmyCardRow soldierNum={numSwordsman} soldierName={"Swordsman"} />
      <CastleAttackModalArmyCardRow soldierNum={numArcher} soldierName={"Archer"} />
      <CastleAttackModalArmyCardRow soldierNum={numCavalry} soldierName={"Cavalry"} />
    </div>
  )
}

const CastleAttackModalArmyCardRow = ({ soldierNum, soldierName }: {
  soldierNum: number,
  soldierName: string
}) => {
  return (
    <div className="row text-center mt-2">
      <p>
        {soldierName && soldierName}: {soldierNum && soldierNum}
      </p>
    </div>
  )
}

const CastleAttackModalHeader = () => {
  return (
    <h5 className="offcanvas-title text-center" id="castleAttackDrawerLabel">
      Castle Capture | War - Army Information
    </h5>
  )
}