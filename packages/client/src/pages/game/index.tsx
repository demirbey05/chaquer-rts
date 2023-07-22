import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { useTerrain } from "../../context/TerrainContext";
import { ArmyInfoDrawer } from "../../components/ArmyComp/ArmyInfoDrawer";
import { CastleSettleWarning } from "../../components/CastleComp/CastleSettleWarning";
import { ArmySettleWarning } from "../../components/ArmyComp/ArmySettleWarning";
import { ArmyMoveWarning } from "../../components/ArmyComp/ArmyMoveWarning";
import { PlayerLostWarning } from "../../components/PlayerComp/PlayerLostWarning";
import { ArmyProgressBar } from "../../components/ArmyComp/ArmyProgressBar";
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { useCastle } from "../../context/CastleContext";
import { useArmy } from "../../context/ArmyContext";
import { usePlayer } from "../../context/PlayerContext";
import { WarResultDrawer } from "../../components/WarResultComp/WarResultDrawer";
import { PlayerSeedModal } from '../../components/PlayerSeedComp/PlayerSeedModal';
import { PlayerWaitingStage } from "../../components/PlayerComp/PlayerWaitingStage";

export const Game = () => {
  const { width, height } = useTerrain();
  const { isCastleSettled } = useCastle();
  const { isArmySettleStage, isArmyMoveStage } = useArmy();
  const { playerSeedStage, playerWaitingStage, isPlayerLost } = usePlayer()

  const values = map;
  const terrainStyles = [0, 40];
  const scrollContainerStyles = { zIndex: "0", height: "100vh", overflow: "scroll" }

  return (
    <>
      {!isCastleSettled && <CastleSettleWarning />}
      {isCastleSettled && playerSeedStage && <PlayerSeedModal />}
      {isCastleSettled && !playerSeedStage && playerWaitingStage && <PlayerWaitingStage />}
      {isCastleSettled && isArmySettleStage && <ArmySettleWarning />}
      {isArmyMoveStage && <ArmyMoveWarning />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmyProgressBar />}
      {isPlayerLost && <PlayerLostWarning />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmyInfoDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && <SettingsDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <WarResultDrawer />}

      <ScrollContainer className="scroll-container" style={scrollContainerStyles}>
        <Terrain width={width} height={height} values={values} pixelStyles={terrainStyles} isBorder={false} />
      </ScrollContainer>
    </>
  );
}