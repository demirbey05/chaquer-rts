import { Button } from "@chakra-ui/react";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition } from "../../utils/armyID";
import { useAttack } from "../../context/AttackContext";

function ArmyAttackModal() {
  const { components, systemCalls } = useMUD();
  const { setMyArmyConfig,
    setEnemyArmyConfig,
    myArmyConfig,
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
      console.log("attackFromArmyID or attackToArmyID lengths are greater than 1")
      return
    }
    // @dev gameID attention
    const tx = await systemCalls.attackToArmy(attackFromArmyId[0] as string, attackToArmyId[0] as string, 1)
    if (tx == null) {
      console.log("handleAttack encounter an error!.")
      return
    }
    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-toggle", "");
    document.getElementById(`${attackToArmyPositionToArmy.y},${attackToArmyPositionToArmy.x}`)!.setAttribute("data-bs-target", "");

    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  return (
    <div
      className="offcanvas offcanvas-bottom rounded-4 font-bold text-white"
      data-bs-keyboard="false"
      data-bs-backdrop="false"
      style={{
        width: "500px",
        left: "0",
        right: "0",
        margin: "auto",
        bottom: "25px",
        padding: "10px",
        backgroundColor: "rgb(148, 163, 184, 0.5)"
      }}
      tabIndex={-1}
      id="offcanvasBottom"
      aria-labelledby="offcanvasBottomLabel"
    >
      <h5
        className="offcanvas-title text-center border-bottom border-white"
        id="offcanvasBottomLabel"
      >
        War - Army Information
      </h5>
      <div className="offcanvas-body small">
        <div className="row">
          <div className="col-6">
            <h1 className="text-center bg-success border-bottom border-white text-white p-1">
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
            <h1 className="text-center border-bottom border-white text-white bg-danger p-1">
              Enemy Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman: {enemyArmyConfig && enemyArmyConfig.armyConfig.numSwordsman}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Archer: {enemyArmyConfig && enemyArmyConfig.armyConfig.numArcher}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Cavalry: {enemyArmyConfig && enemyArmyConfig.armyConfig.numCavalry}
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

export default ArmyAttackModal;
