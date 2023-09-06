import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import gameBgImg from '../../images/gameBackground.jpg';
import { useState } from "react";
import { useTerrain } from "../../context/TerrainContext";
import { useCastle } from "../../context/CastleContext";
import { useArmy } from "../../context/ArmyContext";
import { usePlayer } from "../../context/PlayerContext";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { ArmyInfoDrawer } from "../../components/ArmyComp/ArmyInfoDrawer";
import { ArmyProgressBar } from "../../components/ArmyComp/ArmyProgressBar";
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
import { PlayerSeedModal } from '../../components/PlayerSeedComp/PlayerSeedModal';
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { MineCaptureDrawer } from "../../components/MineComp/MineCaptureDrawer";
import { MineProgressBar } from '../../components/MineComp/MineProgressBar';
import { MineInitStage } from '../../components/MineComp/MineInitStage';
import { WarResultDrawer } from "../../components/WarResultComp/WarResultDrawer";
import { CreditProgressBar } from '../../components/CreditComp/CreditProgressBar';
import { MarketDrawer } from "../../components/MarketComp/MarketDrawer";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ShortCutTips } from "../../components/TipsComp/ShortCutTips";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { useGameState } from "../../hooks/useGameState";
import { useCountOfPlayerSeed } from "../../hooks/useCountOfPlayerSeed";
import { limitOfUser } from "../../utils/constants/constants";
import { useIsMineInitialized } from "../../hooks/useIsMineInitialized";
import { DockSettleModal } from "../../components/SeaComp/DockSettleModal";

export const Game = () => {
  const { width, height } = useTerrain();
  const { isCastleSettled } = useCastle();
  const { isArmySettleStage, isArmyMoveStage } = useArmy();
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);

  const gameState = useGameState(1);
  const playerSeedCount = useCountOfPlayerSeed(1);
  const mineInited = useIsMineInitialized(1);

  const values = map;
  const terrainStyles = [0, 40];
  const scrollContainerStyles = {
    zIndex: "0",
    height: "100vh",
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
      {gameState === 2 && !isPlayerLost && <PlayerSeedModal />}
      {(playerSeedCount === limitOfUser) && !mineInited && <MineInitStage />}
      {gameState === 3 && isArmySettleStage && !isPlayerLost && mineInited && <ArmySettleWarning />}
      {gameState === 3 && isArmyMoveStage && !isPlayerLost && mineInited && <ArmyMoveWarning />}
      {(gameState === 3 || gameState === 4) && mineInited && <SettingsDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <CreditProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyInfoDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <MarketDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <PriceListDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ShortCutTips />}
      {gameState === 3 && !isPlayerLost && mineInited && <WarResultDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmySettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <CastleAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineCaptureDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <DockSettleModal />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameState === 4 && isPlayerWinner && <PlayerWonAnimation />}

      {<ZoomHandler zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
      <ScrollContainer className="scrollable-container" style={scrollContainerStyles}>
        <Terrain width={width} height={height} values={values} pixelStyles={terrainStyles} isBorder={false} zoomLevel={zoomLevel} />
      </ScrollContainer>
    </>
  );
}