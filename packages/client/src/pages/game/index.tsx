import "../../styles/globals.css"
import { useState, useRef } from "react";
import { usePlayer } from "../../context/PlayerContext";
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
import { FleetInfoDrawer } from "../../components/SeaComp/FleetInfoDrawer";
import { ArmyMergeDrawer } from "../../components/ArmyComp/ArmyMergeDrawer";
import { ChatMessageDrawer } from "../../components/ChatComp/ChatMessageDrawer";

export const Game = () => {
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const gameState = useGameState(1);
  const playerSeedCount = useCountOfPlayerSeed(1);
  const mineInited = useIsMineInitialized(1);

  return (
    <>
      {!isPlayerLost && <CastleSettleWarning />}
      {!isPlayerLost && <CastleSettleModal />}
      {gameState === 1 && !isPlayerLost && <PlayerWaitingStage />}
      {!(playerSeedCount >= limitOfUser - 2) && gameState === 2 && !isPlayerLost && <PlayerSeedStage />}
      {(playerSeedCount >= limitOfUser - 2) && !mineInited && <MineInitStage />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmySettleWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyUpdateWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyMoveWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <CreditProgressBar />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyInfoDrawer isInputFocused={isInputFocused} />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetInfoDrawer isInputFocused={isInputFocused} />}
      {gameState === 3 && !isPlayerLost && mineInited && <MarketDrawer isInputFocused={isInputFocused} />}
      {gameState === 3 && !isPlayerLost && mineInited && <ShortCutTips />}
      {gameState === 3 && !isPlayerLost && mineInited && <WarResultDrawer isInputFocused={isInputFocused} />}
      {gameState === 3 && !isPlayerLost && mineInited && <ChatMessageDrawer isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} isSpectator={false} />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmySettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyUpdateModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyMergeDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <ArmyAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <CastleAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <MineCaptureDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <DockSettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <DockCaptureDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetSettleModal />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetSettleWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetMoveWarning />}
      {gameState === 3 && !isPlayerLost && mineInited && <FleetAttackDrawer />}
      {gameState === 3 && !isPlayerLost && mineInited && <SeaMineCaptureDrawer />}
      {gameState === 3 && mineInited && <PriceListDrawer isInputFocused={isInputFocused} />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameState === 4 && isPlayerWinner && <PlayerWonAnimation />}

      <SettingsDrawer isInputFocused={isInputFocused} />
      <PlayerListDrawer isInputFocused={isInputFocused} />
      <ZoomHandler isInputFocused={isInputFocused} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <Terrain isBorder={false} zoomLevel={zoomLevel} tileSize={40} fontSize={20} isSpectator={false} />
    </>
  );
}