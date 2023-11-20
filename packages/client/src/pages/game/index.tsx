import "../../styles/globals.css"
import { useEffect, useState } from "react";
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

export const Game = () => {
  const { gameID } = useGame();
  const { isPlayerLost, isPlayerWinner } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const gameData = useGameData(gameID);

  useEffect(() => {
    const checkAndScroll = () => {
      const targetDiv = document.getElementById("12,12");
      const scrollOptions = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      };

      if (targetDiv) {
        targetDiv.scrollIntoView(scrollOptions);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkAndScroll, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {!isPlayerLost && <CastleSettleWarning />}
      {!isPlayerLost && <CastleSettleModal />}
      {gameData && gameData.state === 1 && !isPlayerLost && <PlayerWaitingStage />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmySettleWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyUpdateWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyMoveWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && <MineProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && <CreditProgressBar />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyInfoDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && <FleetInfoDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && <MarketDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ShortCutTips />}
      {gameData && gameData.state === 2 && !isPlayerLost && <GameTutorial />}
      {gameData && gameData.state === 2 && !isPlayerLost && <WarResultDrawer isInputFocused={isInputFocused} />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ChatMessageDrawer isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} isSpectator={false} />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmySettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyUpdateModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyMergeDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <ArmyAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <CastleAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <MineCaptureDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <DockSettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && <DockCaptureDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <FleetSettleModal />}
      {gameData && gameData.state === 2 && !isPlayerLost && <FleetSettleWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && <FleetMoveWarning />}
      {gameData && gameData.state === 2 && !isPlayerLost && <FleetAttackDrawer />}
      {gameData && gameData.state === 2 && !isPlayerLost && <SeaMineCaptureDrawer />}
      {gameData && gameData.state === 2 && <PriceListDrawer isInputFocused={isInputFocused} isSpectator={false} />}
      {isPlayerLost && <PlayerLostWarning />}
      {gameData && gameData.state === 3 && isPlayerWinner && <PlayerWonAnimation />}

      <VersionInfo />
      <SettingsDrawer isInputFocused={isInputFocused} />
      <PlayerListDrawer isInputFocused={isInputFocused} isSpectator={false} />
      <ZoomHandler isInputFocused={isInputFocused} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <Terrain isBorder={false} zoomLevel={zoomLevel} tileSize={40} isSpectator={false} />
    </>
  );
}