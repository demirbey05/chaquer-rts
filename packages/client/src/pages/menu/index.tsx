import { Grid } from "../../components/TerrainComp/Grid";
import { generatePerlinValues } from "../../terrain-helper/utils";
import TerrainSpinner from "../../components/MenuComp/TerrainSpinner";
import TerrainInfoModal from "../../components/MenuComp/TerrainInfoModal";
import { Button } from "@chakra-ui/react";
import { useTerrain } from "../../context/TerrainContext.js";
import map from "../../../map.json";
import chaquerImg from '../../images/chaquer_bg.png';
import { Link } from "react-router-dom";
import { useMUD } from "../../MUDContext";
import { flatten2D } from "../../utils/terrainArray";
import { ethers } from "ethers";
import { useComponentValue } from "@latticexyz/react";

function Menu() {
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

  const { components, systemCalls } = useMUD();

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
    // @dev GameID should implemented to one of the context above 
    await systemCalls.initMapDataSystem(1, width, height, data)
  };


  const terrainStyles = [8, 14];
  const values = map;

  return (
    <div
      style={{
        backgroundImage: `url(${chaquerImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center h-screen items-center">
          {isLoading === true ? (
            <div className="col-8 align-items-center justify-content-center">
              <TerrainSpinner />
            </div>
          ) : (
            <>
              {refresh === 0 ? null : (
                <div className="col-8 align-items-center justify-content-center">
                  <Grid
                    width={width}
                    height={height}
                    values={values}
                    pixelStyles={terrainStyles}
                    isBorder={true}
                  />
                </div>
              )}
            </>
          )}
          <div className="col-4 align-items-center justify-content-center">
            <h2 className="text-center text-white mb-5 display-4 border-top border-bottom font-bold">
              Chaquer
            </h2>
            {refresh !== 0 && (
              <div className="text-center mt-2 mb-2">
                <Link to="/game">
                  <Button
                    colorScheme="blackAlpha"
                    border="solid"
                    width="200px"
                    isDisabled={isLoading}
                    textColor="white"
                    variant="ghost"
                    p="7"
                    onClick={handleTerrain}
                  >
                    Start the Game
                  </Button>
                </Link>
              </div>
            )}
            <div className="text-center mb-2">
              <Button
                colorScheme="blackAlpha"
                border="solid"
                width="200px"
                isDisabled={isLoading}
                textColor="white"
                variant="ghost"
                onClick={handleRefresh}
                p="7"
                marginTop={refresh === 0 ? "300px" : "0"}
              >
                {refresh === 0 ? "Enter the Game" : "Regenerate the Terrain"}
              </Button>
            </div>
            {refresh !== 0 && (
              <div className="text-center mt-2 mb-2">
                <TerrainInfoModal />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
