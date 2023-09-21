import "../../styles/globals.css"
import gameBgImg from '../../images/backgrounds/gameBackground.jpg'
import ScrollContainer from "react-indiana-drag-scroll";
import { useState } from "react";
import { useCastle } from "../../context/CastleContext";
import { useArmy } from "../../context/ArmyContext";
import { usePlayer } from "../../context/PlayerContext";
import { useFleet } from "../../context/FleetContext";
import { useGameState } from "../../hooks/useGameState";
import { useCountOfPlayerSeed } from "../../hooks/IdentityHooks/useCountOfPlayerSeed";
import { useIsMineInitialized } from "../../hooks/ResourceHooks/useIsMineInitialized";
import { limitOfUser } from "../../utils/constants/constants";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { ArmyInfoDrawer } from "../../components/ArmyComp/ArmyInfoDrawer";
import { ArmyProgressBar } from "../../components/ProgressComp/ArmyProgressBar/ArmyProgressBar";
import { ArmyMoveWarning } from "../../components/ArmyComp/ArmyMoveWarning";
import { ArmySettleModal } from "../../components/ArmyComp/ArmySettleModal";
import { ArmyAttackDrawer } from "../../components/ArmyComp/ArmyAttackDrawer";
import { ArmySettleWarning } from "../../components/ArmyComp/ArmySettleWarning";
import { CastleSettleWarning } from "../../components/CastleComp/CastleSettleWarning";
import { CastleSettleModal } from "../../components/CastleComp/CastleSettleModal"
import { CastleAttackDrawer } from "../../components/CastleComp/CastleAttackDrawer";
import { PlayerLostWarning } from "../../components/PlayerComp/PlayerLostWarning";
import { PlayerWonAnimation } from "../../components/PlayerComp/PlayerWonAnimation";
import { PlayerWaitingStage } from "../../components/PlayerComp/PlayerWaitingStage";
import { PlayerSeedStage } from '../../components/PlayerComp/PlayerSeedStage';
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { MineCaptureDrawer } from "../../components/MineComp/MineCaptureDrawer";
import { MineProgressBar } from '../../components/ProgressComp/MineProgressBar/MineProgressBar';
import { MineInitStage } from '../../components/MineComp/MineInitStage';
import { WarResultDrawer } from "../../components/WarResultComp/WarResultDrawer";
import { CreditProgressBar } from '../../components/ProgressComp/CreditProgressBar/CreditProgressBar';
import { MarketDrawer } from "../../components/MarketComp/MarketDrawer";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ShortCutTips } from "../../components/TipsComp/ShortCutTips";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { DockSettleModal } from "../../components/SeaComp/DockSettleModal";
import { DockCaptureDrawer } from "../../components/SeaComp/DockCaptureDrawer";
import { FleetSettleModal } from "../../components/SeaComp/FleetSettleModal";
import { FleetSettleWarning } from "../../components/SeaComp/FleetSettleWarning";
import { FleetMoveWarning } from "../../components/SeaComp/FleetMoveWarning";
import { FleetAttackDrawer } from "../../components/SeaComp/FleetAttackDrawer";
import { PlayerListDrawer } from "../../components/PlayerComp/PlayerListDrawer";
import { SeaMineCaptureDrawer } from "../../components/SeaComp/SeaMineCaptureDrawer";
import { ArmyUpdateModal } from "../../components/ArmyComp/ArmyUpdateModal";
import { ArmyUpdateWarning } from "../../components/ArmyComp/ArmyUpdateWarning";

export const Game = () => {
  const { isCastleSettled } = useCastle();
  const { isArmySettleStage, isArmyMoveStage, isArmyUpdateStage } = useArmy();
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const { fleetSettleStage, isFleetMoveStage } = useFleet();
  const [zoomLevel, setZoomLevel] = useState(1);

  const gameState = useGameState(1);
  const playerSeedCount = useCountOfPlayerSeed(1);
  const mineInited = useIsMineInitialized(1);

  const terrainStyles = [0, 40];
  const terrainContainer = {
    zIndex: "0",
    height: "100vh",
    minWidth: "100vh",
    overflow: "scroll",
    backgroundImage: `url(${gameBgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  }

  return (
    <>
      {!isCastleSettled && !isPlayerLost && <CastleSettleWarning />}
      {!isCastleSettled && !isPlayerLost && <CastleSettleModal />}
      {isCastleSettled && gameState === 1 && !isPlayerLost && <PlayerWaitingStage />}
      {gameState === 2 && !isPlayerLost && <PlayerSeedStage />}
      {(playerSeedCount === limitOfUser) && !mineInited && <MineInitStage />}
      {gameState === 3 && isArmySettleStage && !isPlayerLost && mineInited && <ArmySettleWarning />}
      {gameState === 3 && isArmyUpdateStage && !isPlayerLost && mineInited && <ArmyUpdateWarning />}
      {gameState === 3 && isArmyMoveStage && !isPlayerLost && mineInited && <ArmyMoveWarning />}
      <SettingsDrawer />
      <PlayerListDrawer />
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <CreditProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyInfoDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <MarketDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <PriceListDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ShortCutTips />}
      {gameState === 3 && !isPlayerLost && mineInited && <WarResultDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmySettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyUpdateModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <CastleAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineCaptureDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <DockSettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <DockCaptureDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetSettleModal />}
      {gameState === 3 && fleetSettleStage && !isPlayerLost && mineInited && <FleetSettleWarning />}
      {gameState === 3 && isFleetMoveStage && !isPlayerLost && mineInited && <FleetMoveWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <SeaMineCaptureDrawer />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameState === 4 && isPlayerWinner && <PlayerWonAnimation />}

      {<ZoomHandler zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
      <ScrollContainer className="scrollable-container" style={terrainContainer}>
        <Terrain pixelStyles={terrainStyles} isBorder={false} zoomLevel={zoomLevel} />
      </ScrollContainer>
    </>
  );
}