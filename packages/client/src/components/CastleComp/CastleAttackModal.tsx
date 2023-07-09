import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext";
import warInfoBg from "../../images/warInfoBg.png";
import { findIDFromPosition } from "../../utils/armyID";
import { ethers } from "ethers";
import { useMUD } from "../../MUDContext";
import { useToast } from '@chakra-ui/react'
import { useAttack } from "../../context/AttackContext";

function CastleAttackModal() {
  const { components, systemCalls} = useMUD();
  const { abiCoder } = useTerrain();
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

    const attackToCastleId = [...findIDFromPosition(
      attackToArmyPosition,
      components.Position,
    )];

    if (attackFromArmyId.length != 1 || attackToCastleId.length != 1) {
      console.log("attackFromArmyID or attackToCastleID lengths are greater than 1")
      return
    }
    const tx = await systemCalls.castleCapture(attackFromArmyId[0],attackToCastleId[0])
    if(tx == null){
      console.log("handleAttack encounter an error!. In Castle Capturing.")
      return
    }

    setIsAttackStage(false);
    setMyArmyConfig(undefined);
    setEnemyArmyConfig(undefined);
    /* I will implement ephemeral table 
    let winner: number = -1;
    const tc = await tx.wait();
    tc.logs.forEach((value: any) => {
      if (
        value.topics[0] ==
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("CaptureSystem__CaptureResult(uint256)")
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
            description: "You've captured the enemy's castle. You can use the new castle!",
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
            description: "You could not capture the enemy's castle. Nice try!",
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
            description: "All the soldiers are dead for the both side. Draw!",
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
      id="offcanvasBottomCastle"
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
                  Swordsman:{" "}
                  {myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
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
              Castle Army
            </h1>
            <div className="row">
              <div className="row justify-content-center text-center mt-2">
                <p>
                  Swordsman:{" "}
                  {enemyArmyConfig && enemyArmyConfig.armyConfig.numSwordsman}
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

export default CastleAttackModal;
