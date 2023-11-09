import "../../styles/globals.css"
import { useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from "../../context/GameContext";
import { useCountOfPlayerSeed } from "../../hooks/IdentityHooks/useCountOfPlayerSeed";
import { useIsMineInitialized } from "../../hooks/ResourceHooks/useIsMineInitialized";
import { useGameData } from "../../hooks/useGameData";
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
import { VersionInfo } from "../../components/TipsComp/VersionInfo";

export const Game = () => {
  const { gameID } = useGame();
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const gameData = useGameData(gameID);
  const playerSeedCount = useCountOfPlayerSeed(gameID);
  const mineInited = useIsMineInitialized(gameID);

  return (
    <>
      {!isPlayerLost && <CastleSettleWarning />}
      {!isPlayerLost && <CastleSettleModal />}
      {gameData && gameData.state === 1 && !isPlayerLost && <PlayerWaitingStage />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmySettleWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyUpdateWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyMoveWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <MineProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <CreditProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyInfoDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <FleetInfoDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <MarketDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ShortCutTips />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <WarResultDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ChatMessageDrawer isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} isSpectator={false} />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmySettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyUpdateModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyMergeDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <ArmyAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <CastleAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <MineCaptureDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <DockSettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <DockCaptureDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <FleetSettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <FleetSettleWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <FleetMoveWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <FleetAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && mineInited && <SeaMineCaptureDrawer />}
      {gameData && gameData.state === 2 && mineInited && <PriceListDrawer isInputFocused={isInputFocused} isSpectator={false} />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameData && gameData.state === 3 && isPlayerWinner && <PlayerWonAnimation />}

      <VersionInfo />
      <SettingsDrawer isInputFocused={isInputFocused} />
      <PlayerListDrawer isInputFocused={isInputFocused} isSpectator={false} />
      <ZoomHandler isInputFocused={isInputFocused} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <Terrain isBorder={false} zoomLevel={zoomLevel} tileSize={40} fontSize={20} isSpectator={false} />
    </>
  );
}