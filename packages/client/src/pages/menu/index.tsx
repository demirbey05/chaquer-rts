import chaquerImg from '../../images/chaquer_bg.jpg';
import { ethers } from "ethers";
import { Button } from "@chakra-ui/react";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { TerrainSpinner } from "../../components/TerrainComp/TerrainSpinner";
import { UserNameModal } from '../../components/PlayerComp/UserNameModal';
import { GameTutorial } from "../../components/TipsComp/GameTutorial";
import { generatePerlinValues } from "../../terrain-helper/utils";
import { useMUD } from "../../context/MUDContext";
import { useTerrain } from "../../context/TerrainContext.js"
import { flatten2D } from "../../utils/terrainArray";
import { limitOfUser } from "../../utils/constants/constants";
import { useGameState } from "../../hooks/useGameState";

export const Menu = () => {
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

  const { systemCalls } = useMUD();

  const gameState = useGameState(1);

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

  const terrainStyles = [8, 14];

  const menuBackgroundStyles: any = {
    backgroundImage: `url(${chaquerImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }

  return (
    <div style={menuBackgroundStyles}>
      <div className="container d-flex align-items-center h-screen">
        {isLoading === true ? <Spinner /> :
          (<>
            {refresh === 0 ? null : <TerrainMap terrainStyles={terrainStyles} />}
          </>)
        }
        <div className="col">
          <h2 className="text-center text-white text-6xl border-top border-bottom font-bold p-2">
            Chaquer
          </h2>
          {refresh !== 0 && <StartGameButton gameState={gameState} isLoading={isLoading} handleTerrain={handleTerrain} />}
          <RegenerateButton isLoading={isLoading} refresh={refresh} handleRefresh={handleRefresh} />
          {refresh !== 0 && (
            <GameTutorialButton />
          )}
        </div>
      </div>
      <UserNameModal />
      <GameTutorial />
    </div >
  );
}

const Spinner = () => {
  return (
    <div className="col-8 align-items-center justify-content-center">
      <TerrainSpinner />
    </div>
  )
}

interface TerrainMapPropStyles {
  terrainStyles: number[]
}

const TerrainMap = (props: TerrainMapPropStyles) => {
  return (
    <div className="col-8 align-items-center justify-content-center">
      <Terrain
        pixelStyles={props.terrainStyles}
        isBorder={true}
        zoomLevel={1}
      />
    </div>
  )
}

interface StartGameButtonPropTypes {
  isLoading: boolean,
  handleTerrain: any,
  gameState: any
}

const StartGameButton = (props: StartGameButtonPropTypes) => {
  return (
    <div className="text-center mt-2 mb-2">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#userNameModal"
        colorScheme="whiteAlpha"
        textColor="dark"
        p="8"
        mt="16"
        width="200px"
        isDisabled={props.isLoading && props.gameState}
        onClick={props.handleTerrain}
      >
        Start the Game
      </Button>
    </div>
  )
}

interface RegenerateButtonPropTypes {
  isLoading: boolean,
  handleRefresh: any,
  refresh: number
}

const RegenerateButton = (props: RegenerateButtonPropTypes) => {
  return (
    <div className="text-center mb-2">
      <Button
        colorScheme="whiteAlpha"
        p="8"
        textColor="dark"
        width="200px"
        isDisabled={props.isLoading || true}
        onClick={props.handleRefresh}
        marginTop={props.refresh === 0 ? "300px" : "0"}
      >
        {props.refresh === 0 ? "Enter the Game" : "Regenerate the Terrain"}
      </Button>
    </div>
  )
}

const GameTutorialButton = () => {
  return (
    <div className="text-center mt-2 mb-2">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#tutorialModal1"
        colorScheme="whiteAlpha"
        textColor="dark"
        p="8"
        width="200px"
      >
        Game Tutorial
      </Button>
    </div>
  )
}