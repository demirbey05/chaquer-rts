import { Grid } from "../../components/TerrainComp/Grid";
import { useTerrain } from "../../context/TerrainContext";
import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import ArmyInfoModal from "../../components/ArmyComp/ArmyInfoModal";
import CastleWarning from "../../components/CastleComp/CastleWarning";
import ArmyWarning from "../../components/ArmyComp/ArmyWarning";
import ArmyMoveWarning from "../../components/ArmyComp/ArmyMoveWarning";
import LoserWarning from "../../components/GameComp/LoserWarning";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import ArmyProgressComp from "../../components/ArmyComp/ArmyProgressComp";
import AudioControlComp from "../../components/AudioComp/AudioControlComp";
import { useCastle } from "../../context/CastleContext";
import { useArmy } from "../../context/ArmyContext";
import { usePlayer } from "../../context/PlayerContext";

function Game() {
  const { width, height } = useTerrain();
  const { isCastleDeployedBefore, isCastleSettled } = useCastle();
  const { isArmyStage, isArmyMoveStage } = useArmy();
  const {userWallet} = usePlayer()
  const values = map;
  const myCastlePosition = useCastlePositionByAddress(userWallet!.address.toLocaleLowerCase());

  const terrainStyles = [0, 40];

  return (
    <div>
      {!isCastleSettled && <CastleWarning />}
      {isCastleSettled && isArmyStage && <ArmyWarning />}
      {isArmyMoveStage && <ArmyMoveWarning />}
      {isCastleSettled && <ArmyProgressComp />}
      {(myCastlePosition && (myCastlePosition.length === 0) && isCastleDeployedBefore && isCastleSettled) && <LoserWarning />}
      {isCastleSettled && <ArmyInfoModal />}
      {isCastleSettled && <AudioControlComp />}
      <ScrollContainer
        className="scroll-container"
        style={{ zIndex: "0", height: "100vh", overflow: "scroll" }}
      >
        <Grid
          width={width}
          height={height}
          values={values}
          pixelStyles={terrainStyles}
          isBorder={false}
        />
      </ScrollContainer>
    </div>
  );
}

export default Game;
