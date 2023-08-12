import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import tileBgImg from '../../images/tile-background.png';
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
import { PlayerWaitingStage } from "../../components/PlayerComp/PlayerWaitingStage";
import { PlayerSeedModal } from '../../components/PlayerSeedComp/PlayerSeedModal';
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { MineCaptureDrawer } from "../../components/MineComp/MineCaptureDrawer";
import { MineProgressBar } from '../../components/MineComp/MineProgressBar';
import { WarResultDrawer } from "../../components/WarResultComp/WarResultDrawer";
import { CreditProgressBar } from '../../components/CreditComp/CreditProgressBar';
import { MarketDrawer } from "../../components/MarketComp/MarketDrawer";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ShortCutTips } from "../../components/TipsComp/ShortCutTips";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";

export const Game = () => {
  const { width, height } = useTerrain();
  const { isCastleSettled } = useCastle();
  const { isArmySettleStage, isArmyMoveStage } = useArmy();
  const { playerSeedStage, playerWaitingStage, isPlayerLost } = usePlayer();
  const [zoomLevel, setZoomLevel] = useState(1);

  const values = map;
  const terrainStyles = [0, 40];
  const scrollContainerStyles = {
    zIndex: "0",
    height: "100vh",
    overflow: "scroll",
    backgroundImage: `url(${tileBgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  }

  return (
    <>
      {!isCastleSettled && <CastleSettleWarning />}
      {isCastleSettled && isArmySettleStage && <ArmySettleWarning />}
      {isArmyMoveStage && <ArmyMoveWarning />}
      {isPlayerLost && <PlayerLostWarning />}
      {isCastleSettled && playerSeedStage && <PlayerSeedModal />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && <SettingsDrawer />}
      {isCastleSettled && !playerSeedStage && playerWaitingStage && <PlayerWaitingStage />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmyProgressBar />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <MineProgressBar />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <CreditProgressBar />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmyInfoDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <MarketDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <PriceListDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ShortCutTips />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <WarResultDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmySettleModal />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <ArmyAttackDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <CastleAttackDrawer />}
      {isCastleSettled && !playerSeedStage && !playerWaitingStage && !isPlayerLost && <MineCaptureDrawer />}
      {!isCastleSettled && <CastleSettleModal />}


      {<ZoomHandler zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
      <ScrollContainer className="scrollable-container" style={scrollContainerStyles}>
        <Terrain width={width} height={height} values={values} pixelStyles={terrainStyles} isBorder={false} zoomLevel={zoomLevel} />
      </ScrollContainer>
    </>
  );
}