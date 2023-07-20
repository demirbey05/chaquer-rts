import map from "../../../map.json";
import chaquerImg from '../../images/chaquer_bg.png';
import { Grid } from "../../components/TerrainComp/Grid";
import { generatePerlinValues } from "../../terrain-helper/utils";
import { TerrainSpinner } from "../../components/MenuComp/TerrainSpinner";
import { TerrainInfoModal } from "../../components/MenuComp/TerrainInfoModal";
import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext.js"
import { UserNameModal } from '../../components/MenuComp/UserNameModal';
import { useMUD } from "../../MUDContext";
import { flatten2D } from "../../utils/terrainArray";
import { ethers } from "ethers";

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
    const data: string = ethers.utils.hexlify(flatten2D(map));
    await systemCalls.initMapDataSystem(1, width, height, data);
    await systemCalls.InitNumberOfGamer(1, 10);
  };

  const terrainStyles = [8, 14];
  const values = map;

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
            {refresh === 0 ? null : <TerrainMap width={width} height={height} values={values} terrainStyles={terrainStyles} />}
          </>)
        }
        <div className="col">
          <h2 className="text-center text-white display-4 border-top border-bottom font-bold">
            Chaquer
          </h2>
          {refresh !== 0 && <StartGameButton isLoading={isLoading} handleTerrain={handleTerrain} />}
          <RegenerateButton isLoading={isLoading} refresh={refresh} handleRefresh={handleRefresh} />
          {refresh !== 0 && (
            <div className="text-center mt-2 mb-2">
              <TerrainInfoModal />
            </div>
          )}
        </div>
      </div>
      <UserNameModal />
    </div >
  );
}

const Spinner = () => {
  return (
    <>
      <div className="col-8 align-items-center justify-content-center">
        <TerrainSpinner />
      </div>
    </>
  )
}

interface TerrainMapPropStyles {
  width: number,
  height: number,
  values: number[][],
  terrainStyles: number[]
}

const TerrainMap = (props: TerrainMapPropStyles) => {
  return (
    <div className="col-8 align-items-center justify-content-center">
      <Grid
        width={props.width}
        height={props.height}
        values={props.values}
        pixelStyles={props.terrainStyles}
        isBorder={true}
      />
    </div>
  )
}

interface StartGameButtonPropTypes {
  isLoading: boolean,
  handleTerrain: any
}

const StartGameButton = (props: StartGameButtonPropTypes) => {
  return (
    <div className="text-center mt-2 mb-2">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#userNameModal"
        colorScheme="blackAlpha"
        border="solid"
        width="200px"
        isDisabled={props.isLoading}
        textColor="white"
        variant="ghost"
        p="7"
        mt="16"
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
        colorScheme="blackAlpha"
        border="solid"
        width="200px"
        isDisabled={props.isLoading}
        textColor="white"
        variant="ghost"
        onClick={props.handleRefresh}
        p="7"
        marginTop={props.refresh === 0 ? "300px" : "0"}
      >
        {props.refresh === 0 ? "Enter the Game" : "Regenerate the Terrain"}
      </Button>
    </div>
  )
}