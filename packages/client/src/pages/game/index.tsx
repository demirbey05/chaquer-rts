import "../../styles/globals.css"
import { useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from "../../context/GameContext";
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
import { GameTutorial } from "../../components/TipsComp/GameTutorial";
import { scrollToCenter } from "../../utils/helperFunctions/CustomFunctions/scrollToCenter";

export const Game = () => {
  const { gameID } = useGame();
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const gameData = useGameData(gameID);

  const playerWaiting: boolean = gameData && gameData.state === 1 && !isPlayerLost
  const gameIsStarted: boolean = gameData && gameData.state === 2 && !isPlayerLost
  const gameOver: boolean = gameData && gameData.state === 3 && isPlayerWinner

  scrollToCenter()

  return (
    <>
      {!isPlayerLost && <CastleSettleWarning />}
      {!isPlayerLost && <CastleSettleModal />}
      {playerWaiting && <PlayerWaitingStage />}
      {gameIsStarted && <ArmySettleWarning />}
      {gameIsStarted && <ArmyUpdateWarning />}
      {gameIsStarted && <ArmyMoveWarning />}
      {gameIsStarted && <ArmyProgressBar />}
      {gameIsStarted && <MineProgressBar />}
      {gameIsStarted && <CreditProgressBar />}
      {gameIsStarted && <ArmyInfoDrawer isInputFocused={isInputFocused} />}
      {gameIsStarted && <FleetInfoDrawer isInputFocused={isInputFocused} />}
      {gameIsStarted && <MarketDrawer isInputFocused={isInputFocused} />}
      {gameIsStarted && <ShortCutTips />}
      {gameIsStarted && <GameTutorial />}
      {gameIsStarted && <WarResultDrawer isInputFocused={isInputFocused} />}
      {gameIsStarted && <ChatMessageDrawer isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} isSpectator={false} />}
      {gameIsStarted && <ArmySettleModal />}
      {gameIsStarted && <ArmyUpdateModal />}
      {gameIsStarted && <ArmyMergeDrawer />}
      {gameIsStarted && <ArmyAttackDrawer />}
      {gameIsStarted && <CastleAttackDrawer />}
      {gameIsStarted && <MineCaptureDrawer />}
      {gameIsStarted && <DockSettleModal />}
      {gameIsStarted && <DockCaptureDrawer />}
      {gameIsStarted && <FleetSettleModal />}
      {gameIsStarted && <FleetSettleWarning />}
      {gameIsStarted && <FleetMoveWarning />}
      {gameIsStarted && <FleetAttackDrawer />}
      {gameIsStarted && <SeaMineCaptureDrawer />}
      {gameIsStarted && <PriceListDrawer isInputFocused={isInputFocused} isSpectator={false} />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameOver && <PlayerWonAnimation />}

      <Terrain zoomLevel={zoomLevel} isSpectator={false} />
      <SettingsDrawer isInputFocused={isInputFocused} />
      <PlayerListDrawer isInputFocused={isInputFocused} isSpectator={false} />
      <VersionInfo />
      <ZoomHandler isInputFocused={isInputFocused} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
    </>
  );
}