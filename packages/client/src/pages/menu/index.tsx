import map from '../../../map.json';
import { ethers } from "ethers";
import { Progress } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useTerrain } from "../../context/TerrainContext.js"
import { Terrain } from "../../components/TerrainComp/Terrain";
import { TerrainSpinner } from "../../components/TerrainComp/TerrainSpinner";
import { UserNameModal } from '../../components/PlayerComp/UserNameModal';
import { GameTutorial } from "../../components/TipsComp/GameTutorial";
import { generatePerlinValues } from "../../terrain-helper/utils";
import { flatten2D } from "../../utils/terrainArray";
import { limitOfUser } from "../../utils/constants/constants";
import { useGameState } from "../../hooks/useGameState";
import { useSyncProgress } from "../../hooks/useSyncProgress";

export const Menu = () => {
  const { systemCalls } = useMUD();
  const {
    setIsLoading,
    width,
    height,
    setValues,
    setRefresh,
    refresh,
    isLoading,
    setPermArray,
    saveTerrain,
  } = useTerrain();

  const gameState = useGameState(1);
  const progress = useSyncProgress();

  const terrainStyles = [8, 14];

  const handleRefresh = (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    const { valuesArray, perm } = generatePerlinValues(height, width);
    setValues(valuesArray);
    setPermArray(perm);
    setRefresh(refresh + 1);
  };

  const handleTerrain = async () => {
    saveTerrain();
    if (!gameState) {
      const data: string = ethers.utils.hexlify(flatten2D(map));
      await systemCalls.initMapDataSystem(1, width, height, data);
      await systemCalls.InitNumberOfGamer(1, limitOfUser);
    }
  };

  return (
    <div className='menu-background'>
      <div className="menu-row" style={refresh === 0 ? { justifyContent: "center" } : { justifyContent: "space-evenly" }}>
        <div id="menu-items">
          <h2 className="menu-title">
            Chaquer
          </h2>
          {refresh === 0 && <Loader progress={progress} />}
          {refresh === 0 && <EnterGameButton handleRefresh={handleRefresh} percentage={progress && progress.percentage} />}
          {refresh !== 0 && <StartGameButton gameState={gameState} isLoading={isLoading} handleTerrain={handleTerrain} />}
          {refresh !== 0 && <RegenerateButton handleRefresh={handleRefresh} isLoading={isLoading} />}
          {refresh !== 0 && <GameTutorialButton />}
          <div className="loader-footer">
            powered by Nakamo & MUD
          </div>
        </div>
        <div id="map">
          {isLoading === true ? <TerrainSpinner /> :
            (<>
              {refresh === 0 ? null : <Terrain pixelStyles={terrainStyles} isBorder={true} zoomLevel={1} />}
            </>)
          }
        </div>
      </div>
      <UserNameModal />
      <GameTutorial />
    </div>
  );
}

const StartGameButton = ({ isLoading, handleTerrain, gameState }: { isLoading: boolean, handleTerrain: () => Promise<void>, gameState: any }) => {
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      style={{ marginTop: "100px" }}
      data-bs-toggle="modal"
      data-bs-target="#userNameModal"
      disabled={isLoading && gameState}
      onClick={handleTerrain}
    >
      Start the Game
    </button>
  )
}

const RegenerateButton = ({ isLoading, handleRefresh }: { isLoading: boolean, handleRefresh: (event: any) => void, }) => {
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      disabled={isLoading || true}
      onClick={handleRefresh}
    >
      Regenerate the Terrain
    </button>
  )
}

const EnterGameButton = ({ handleRefresh, percentage }: { handleRefresh: (event: any) => void, percentage: number }) => {
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      onClick={handleRefresh}
      disabled={percentage !== 100}>
      Enter the Game
    </button>
  )
}

const GameTutorialButton = () => {
  return (
    <button
      className='btn btn-dark menu-buttons'
      data-bs-toggle="modal"
      data-bs-target="#tutorialModal1">
      Game Tutorial
    </button>
  )
}

const Loader = ({ progress }: { progress: any }) => {
  return (
    <>
      <div className="loader-box">
        <div className="d-flex justify-content-center pt-3">
          <Progress colorScheme="linkedin"
            borderRadius={"25px"}
            width={"75%"}
            height='32px'
            hasStripe
            isAnimated
            value={progress ? progress.percentage * 100 : 0} />
        </div>
        <div className="text-center p-3">
          <p className="text-white text-2xl">{progress ? (progress.percentage !== 100 ? progress.percentage * 100 : 100) : 0}%</p>
          <p className="text-white text-xl">{progress ? progress.message : "Fetching data from blockchain"}...</p>
        </div>
      </div>
    </>
  )
}