import { Button } from "@chakra-ui/react";
import { findIDFromPosition } from "../../utils/armyID";
import { useMUD } from "../../MUDContext";
import { useAttack } from "../../context/AttackContext";
import { findCastleCloseArmies } from "../../utils/findCastleCloseArmies";
import { useEffect, useState } from "react";

function CastleAttackModal() {
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
      id="offcanvasBottomCastle"
      aria-labelledby="offcanvasBottomLabel"
    >
      <h5
        className="offcanvas-title text-center border-bottom border-white text-white"
        id="offcanvasBottomLabel"
      >
        War - Army Information
      </h5>
      <div className="offcanvas-body small">
        <div className="row">
          <div className="col-6">
            <h1 className="text-center border-bottom border-white text-white p-1 bg-success">
              My Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman: {myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Archer: {myArmyConfig && myArmyConfig.armyConfig.numArcher}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Cavalry: {myArmyConfig && myArmyConfig.armyConfig.numCavalry}
                </p>
              </div>
            </div>
          </div>
          <div className="col-6">
            <h1 className="text-center border-bottom border-danger text-white p-1 bg-danger">
              Castle Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman: {castleArmy && castleArmy.numSwordsman}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Archer: {castleArmy && castleArmy.numArcher}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Cavalry: {castleArmy && castleArmy.numCavalry}
                </p>
              </div>
            </div>
          </div>
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

export default CastleAttackModal;
