import "../../styles/globals.css";
import MapImg from '../../images/map.png';
import { TerrainType } from "../../terrain-helper/types";
import { useRef } from "react";
import { Entity } from "@latticexyz/recs";
import { useCastle } from "../../context/CastleContext";
import { useAttack } from "../../context/AttackContext";
import { usePlayer } from "../../context/PlayerContext";
import { useArmy } from "../../context/ArmyContext";
import { useMine } from "../../context/MineContext";
import { useSea } from "../../context/SeaContext";
import { useError } from "../../context/ErrorContext";
import { useMUD } from "../../MUDContext";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useMyCastlePositions } from "../../hooks/useMyCastlePositions";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useMyArmy } from "../../hooks/useMyArmy";
import { useResources } from "../../hooks/useResources";
import { useMyResourcePositions } from "../../hooks/useMyResourcePositions";
import { useDockPositions } from "../../hooks/useDockPositions";
import { Coord } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { getTerrainAsset } from '../../utils/helperFunctions/CustomFunctions/getTerrainAsset';
import { isMyCastle } from '../../utils/helperFunctions/CastleFunctions/isMyCastle';
import { isUserClickedManhattanPosition } from '../../utils/helperFunctions/CustomFunctions/isUserClickedManhattanPosition';
import { getDataAtrY, getDataAtrX } from "../../utils/helperFunctions/CustomFunctions/getIdDataAtr";
import { canCastleBeSettle } from "../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isMyArmy } from "../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyArmy } from "../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";
import { isEnemyCastle } from "../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { isUserClickedMine } from "../../utils/helperFunctions/ResourceFuntions/isUserClickedMine";
import { useMyDockPositions } from "../../hooks/useMyDockPositions";
import { isPositionNextToSea } from "../../utils/helperFunctions/SeaFunctions/isPositionNextToSea";
import { CastleEffects } from "./Effects/CastleEffects";
import { ResourceEffects } from "./Effects/ResourceEffects";
import { ArmyEffects } from "./Effects/ArmyEffects";
import { AttackEffects } from "./Effects/AttackEffects";
import { HoverEffects } from "./Effects/HoverEffects";
import { DockEffects } from "./Effects/DockEffects";
import { ArmyAttackEvent } from "./Events/ArmyAttackEvent";
import { CastleAttackEvent } from "./Events/CastleAttackEvent";
import { MineCaptureEvent } from "./Events/MineCaptureEvent";
import { DockSettleEvent } from "./Events/DockSettleEvent";
import { ArmyMoveEvent } from "./Events/ArmyMoveEvent";
import { isValidTerrainType } from "../../utils/helperFunctions/CustomFunctions/isValidTerrainType";
import { isMyDock } from "../../utils/helperFunctions/SeaFunctions/isMyDock";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
  zoomLevel: number;
};

export const Terrain = (props: DataProp) => {
  const width = props.width;
  const height = props.height;
  const values = props.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const { components,
    systemCalls } = useMUD();

  const { setAttackFromArmyPositionToArmy,
    setAttackToArmyPositionToArmy,
    setAttackFromArmyPositionToCastle,
    setAttackToArmyPositionToCastle,
    isAttackStage,
    setIsAttackStage,
    setMyArmyConfig,
    setEnemyArmyConfig } = useAttack();

  const { setIsArmyMoveStage,
    isArmyMoveStage,
    fromArmyPosition,
    setFromArmyPosition,
    isArmySettleStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy,
    setIsArmySettleStage } = useArmy();

  const { userWallet } = usePlayer();

  const { isCastleSettled,
    setIsCastleSettled,
    setTempCastle } = useCastle();

  const { isMineStage,
    setIsMineStage,
    setTargetMinePosition,
    setAttackFromArmyPositionToMine } = useMine();

  const { dockSettleStage,
    setDockSettleStage,
    setArmyPositionToSettleDock,
    setDockPosition } = useSea();

  const { setShowError,
    setErrorMessage,
    setErrorTitle } = useError();

  const movingArmyId = useRef<Entity>("0" as Entity);
  const toArmyPositionRef = useRef<{ x: number, y: number }>({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord | undefined>({ x: "-1", y: "-1" });

  const castlePositions = useCastlePositions();
  const myCastlePosition = useMyCastlePositions(userWallet);
  const armyPositions = useArmyPositions()[0];
  const myArmyPosition: any = useMyArmy(userWallet)[0];
  const myArmyNumber = useMyArmy(userWallet)[1];
  const resources = useResources();
  const myResourcePositions = useMyResourcePositions(userWallet);
  const dockPositions = useDockPositions();
  const myDockPositions = useMyDockPositions(userWallet)

  const handleClick = async (e: any) => {
    // For Putting army Grid with clicking castle
    if (!isArmyMoveStage && isMyCastle(myCastlePosition, getDataAtrX(e), getDataAtrY(e))) {
      if (isArmySettleStage) {
        setIsArmySettleStage(false);
      }
      else if (!isArmySettleStage && numberOfArmy < 5) {
        setIsArmySettleStage(true);
      }
    }

    // Keep castle position as temp
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    // Keep army position as temp
    if (isArmySettleStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    // Logic of Army-Castle-Mine-Dock Attack and Dock Settle
    if (!fromArmyPosition && isCastleSettled && !isArmySettleStage && myArmyPosition && isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
      setIsAttackStage(true);
      setIsMineStage(true)
      setDockSettleStage(true);
    }
    else if (fromArmyPosition && isUserClickedManhattanPosition(fromArmyPosition, getDataAtrX(e), getDataAtrY(e))) {
      toArmyPositionRef.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromArmyPositionRef.current = { x: fromArmyPosition.x, y: fromArmyPosition.y, };

      if (isEnemyArmy(toArmyPositionRef.current, armyPositions, myArmyPosition)) {
        ArmyAttackEvent(setIsArmyMoveStage, setIsMineStage, setDockSettleStage, setFromArmyPosition, setAttackFromArmyPositionToArmy, setAttackToArmyPositionToArmy, fromArmyPositionRef, toArmyPositionRef, setMyArmyConfig, setEnemyArmyConfig, myArmyPosition, armyPositions);
      }
      else if (isEnemyCastle(toArmyPositionRef.current, myCastlePosition, castlePositions)) {
        CastleAttackEvent(setIsArmyMoveStage, setIsMineStage, setDockSettleStage, setFromArmyPosition, setAttackFromArmyPositionToCastle, setAttackToArmyPositionToCastle, fromArmyPositionRef, toArmyPositionRef, setMyArmyConfig, myArmyPosition)
      }
      else if (isUserClickedMine(toArmyPositionRef.current.x, toArmyPositionRef.current.y, resources)) {
        MineCaptureEvent(setIsArmyMoveStage, setIsAttackStage, setDockSettleStage, setFromArmyPosition, setAttackFromArmyPositionToMine, fromArmyPositionRef, setTargetMinePosition, toArmyPositionRef, setMyArmyConfig, myArmyPosition);
      }
      else if (isPositionNextToSea(toArmyPositionRef.current.x, toArmyPositionRef.current.y, values) && isMyArmy({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }, myArmyPosition)) {
        DockSettleEvent(setIsMineStage, setIsAttackStage, setIsArmyMoveStage, setFromArmyPosition, setArmyPositionToSettleDock, fromArmyPositionRef, setDockPosition, toArmyPositionRef);
      }
      else if (canCastleBeSettle(values[toArmyPositionRef.current.x][toArmyPositionRef.current.y]) && !isMyCastle(myCastlePosition, toArmyPositionRef.current.x, toArmyPositionRef.current.y) && !isMyDock(parseInt(fromArmyPositionRef.current.x), parseInt(fromArmyPositionRef.current.y), myDockPositions)) {
        await ArmyMoveEvent(setIsAttackStage, setIsMineStage, setDockSettleStage, fromArmyPositionRef, setIsArmyMoveStage, toArmyPositionRef, isArmyMoveStage, fromArmyPosition, setFromArmyPosition, components, movingArmyId, systemCalls, setErrorMessage, setErrorTitle, setShowError);
      }
    }
    else {
      setIsArmyMoveStage(false);
      setIsAttackStage(false);
      setIsMineStage(false)
      setDockSettleStage(false);
      setFromArmyPosition(undefined);
      toArmyPositionRef.current = { x: -1, y: -1 };
      fromArmyPositionRef.current = { x: "-1", y: "-1" };
    }
  };

  CastleEffects(myCastlePosition, setIsCastleSettled, castlePositions, isCastleSettled);
  ResourceEffects(myResourcePositions, resources, isMineStage, fromArmyPosition);
  ArmyEffects(castlePositions, isArmySettleStage, armyPositions, myArmyPosition, setNumberOfArmy, myArmyNumber, resources);
  AttackEffects(myCastlePosition, castlePositions, armyPositions, myArmyPosition, isAttackStage, fromArmyPosition);
  HoverEffects(armyPositions, resources, numberOfArmy, isArmySettleStage, props.isBorder, castlePositions, myCastlePosition, values, fromArmyPosition, isArmyMoveStage);
  DockEffects(castlePositions, resources, myArmyPosition, armyPositions, dockPositions, myDockPositions, values, dockSettleStage, rows, columns);

  return (
    <div className={`inline-grid ${props.isBorder && "border-4 border-black"}`}
      style={{
        transform: `scale(${props.zoomLevel})`,
        transition: "transform 0.2s ease-in-out",
        zIndex: "1",
        backgroundImage: `url(${MapImg})`, // Remove the 4 next line to remove AI generated terrain
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxShadow: "20px 20px rgba(0, 0, 0, 0.5)",
      }} >
      {
        rows.map((row) => {
          return columns.map((column) => {
            return (
              <span
                key={`${column},${row}`}
                id={`${column},${row}`}
                data-row={`${row}`}
                data-column={`${column}`}
                style={{
                  gridColumn: column + 1,
                  gridRow: row + 1,
                  width: `${props.pixelStyles[1]}px`,
                  height: `${props.pixelStyles[1]}px`,
                  //backgroundImage: `${getTerrainAsset(values[row][column])}`, // remove the next 2 line for AI generated map
                  //backgroundSize: "cover",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: `${props.isBorder ? "7px" : "20px"}`,
                  border: "0.5px solid rgba(0, 0, 0, 0.1)"
                }}
                onClick={(e) => {
                  handleClick(e);
                }}
                className={`
                ${!props.isBorder &&
                  isValidTerrainType(values[row][column]) &&
                  "hoverTileEffect"
                  }`}
                data-bs-toggle={`${canCastleBeSettle(values[row][column]) &&
                  !isCastleSettled &&
                  !props.isBorder
                  ? "modal" : ""
                  }`}
                data-bs-target={`${canCastleBeSettle(values[row][column]) &&
                  !isCastleSettled &&
                  !props.isBorder
                  ? "#castleSettleModal" : ""
                  }`}
              ></span>
            );
          });
        })
      }
    </div >
  );
}
