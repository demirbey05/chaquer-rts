import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext";
import warInfoBg from "../../images/warInfoBg.png";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition } from "../../utils/armyID";
import { ethers } from "ethers";
import { useToast } from '@chakra-ui/react'
import { useAttack } from "../../context/AttackContext";
import { useScoreTable } from "../../hooks/useScoreTable";

function ArmyAttackModal() {
  const { components,systemCalls } = useMUD();
  const { setMyArmyConfig,
    setEnemyArmyConfig,
    myArmyConfig,
    enemyArmyConfig,
    setIsAttackStage,
    attackFromArmyPosition,
    attackToArmyPosition } = useAttack();
  const toast = useToast()

  const handleAttackLater = () => {
    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
  };

  const handleAttack = async () => {
    const attackFromArmyId = [...findIDFromPosition(
      attackFromArmyPosition,
      components.Position,
    )];

    const attackToArmyId = [...findIDFromPosition(
      attackToArmyPosition,
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
      document.getElementById(`${attackToArmyPosition.y},${attackToArmyPosition.x}`)!.setAttribute("data-bs-toggle", "");
      document.getElementById(`${attackToArmyPosition.y},${attackToArmyPosition.x}`)!.setAttribute("data-bs-target", "");

      setIsAttackStage(false);
      setMyArmyConfig(undefined);
      setEnemyArmyConfig(undefined);

      /* Ephemeral Table Implementation

      let winner: number = -1;
      const tc = await tx.wait();
      tc.logs.forEach((value: any) => {
        if (
          value.topics[0] ==
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes("AttackSystem__BattleResult(uint256)")
          )
        ) {
          winner = parseInt(value.data);
        }
      });

      if (winner !== -1) {
        if (winner === 1) {
          return (
            toast({
              title: 'War Result',
              description: "You've defeated the enemy army. Congrats!",
              status: 'success',
              duration: 9000,
              position: "top-right",
              isClosable: true,
            })
          )
        }
        else if (winner === 2) {
          return (
            toast({
              title: 'War Result',
              description: "You've lost the war. Nice try!",
              status: 'error',
              duration: 9000,
              position: "top-right",
              isClosable: true,
            })
          )
        }
        else {
          return (
            toast({
              title: 'War Result',
              description: "All soldiers in the battle field are dead for the both side. Draw!",
              status: 'info',
              duration: 9000,
              position: "top-right",
              isClosable: true,
            })
          )
        }

      }*/
    
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
        backgroundImage: `url(${warInfoBg})`,
        backgroundSize: "cover",
      }}
      tabIndex={-1}
      id="offcanvasBottom"
      aria-labelledby="offcanvasBottomLabel"
    >
      <h5
        className="offcanvas-title text-center border-bottom border-dark text-dark"
        id="offcanvasBottomLabel"
      >
        War-Army Information
      </h5>
      <div className="offcanvas-body small">
        <div className="row">
          <div className="col-6">
            <h1 className="text-center border-bottom border-success text-dark">
              My Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman:{myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
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
            <h1 className="text-center border-bottom border-danger text-dark">
              Enemy Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman:{enemyArmyConfig && enemyArmyConfig.armyConfig.numSwordsman}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Archer:{" "}
                  {enemyArmyConfig && enemyArmyConfig.armyConfig.numArcher}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Cavalry:{" "}
                  {enemyArmyConfig && enemyArmyConfig.armyConfig.numCavalry}
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
