import gameBgImg from '../../images/backgrounds/game-page-background.jpg'
import chaquerMap from '../../images/backgrounds/chaquer-map.jpg'
import map from "../../../map.json";
import ScrollContainer from 'react-indiana-drag-scroll'
import { TerrainType } from "../../terrain-helper/types";
import { useRef, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { useCastle } from "../../context/CastleContext";
import { useAttack } from "../../context/AttackContext";
import { usePlayer } from "../../context/PlayerContext";
import { useArmy } from "../../context/ArmyContext";
import { useMine } from "../../context/MineContext";
import { useSea } from "../../context/SeaContext";
import { useFleet } from "../../context/FleetContext";
import { useTerrain } from "../../context/TerrainContext";
import { useError } from "../../context/ErrorContext";
import { useMUD } from "../../context/MUDContext";
import { useGame } from '../../context/GameContext';
import { useCastlePositions } from "../../hooks/CastleHooks/useCastlePositions";
import { useMyCastlePositions } from "../../hooks/CastleHooks/useMyCastlePositions";
import { useArmyPositions } from "../../hooks/ArmyHooks/useArmyPositions";
import { useMyArmy } from "../../hooks/ArmyHooks/useMyArmy";
import { useResources } from "../../hooks/ResourceHooks/useResources";
import { useMyResourcePositions } from "../../hooks/ResourceHooks/useMyResourcePositions";
import { useDockPositions } from "../../hooks/SeaHooks/useDockPositions";
import { useMyDockPositions } from "../../hooks/SeaHooks/useMyDockPositions";
import { useFleetPositions } from "../../hooks/SeaHooks/useFleetPositions";
import { useMyFleetPositions } from "../../hooks/SeaHooks/useMyFleetPositions";
import { Coord } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { getNumberOfSoldierInArmy } from "../../utils/helperFunctions/ArmyFunctions/getNumberOfSoliderInArmy";
import { isValidTerrainType } from '../../utils/helperFunctions/CustomFunctions/isValidTerrainType';
import { isMyCastle } from '../../utils/helperFunctions/CastleFunctions/isMyCastle';
import { isUserClickedManhattanPosition } from '../../utils/helperFunctions/CustomFunctions/isUserClickedManhattanPosition';
import { getDataAtrY, getDataAtrX } from "../../utils/helperFunctions/CustomFunctions/getIdDataAtr";
import { canCastleBeSettle } from "../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isMyArmy } from "../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyArmy } from "../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";
import { isEnemyCastle } from "../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { isUserClickedMine } from "../../utils/helperFunctions/ResourceFuntions/isUserClickedMine";
import { isPositionNextToSea } from "../../utils/helperFunctions/SeaFunctions/isPositionNextToSea";
import { isMyDock } from "../../utils/helperFunctions/SeaFunctions/isMyDock";
import { isEnemyDock } from "../../utils/helperFunctions/SeaFunctions/isEnemyDock";
import { CastleEffects } from "./Effects/CastleEffects";
import { ResourceEffects } from "./Effects/ResourceEffects";
import { ArmyEffects } from "./Effects/ArmyEffects";
import { AttackEffects } from "./Effects/AttackEffects";
import { HoverEffects } from "./Effects/HoverEffects";
import { DockEffects } from "./Effects/DockEffects";
import { FleetEffects } from "./Effects/FleetEffects";
import { ArmyAttackEvent } from "./Events/ArmyAttackEvent";
import { CastleAttackEvent } from "./Events/CastleAttackEvent";
import { MineCaptureEvent } from "./Events/MineCaptureEvent";
import { DockSettleEvent } from "./Events/DockSettleEvent";
import { ArmyMoveEvent } from "./Events/ArmyMoveEvent";
import { DockCaptureEvent } from "./Events/DockCaptureEvent";
import { canFleetBeSettled } from "../../utils/helperFunctions/SeaFunctions/canFleetBeSettled";
import { isMyFleet } from "../../utils/helperFunctions/SeaFunctions/isMyFleet";
import { FleetMoveEvent } from "./Events/FleetMoveEvent";
import { FleetAttackEvent } from "./Events/FleetAttackEvent";
import { isEnemyFleet } from "../../utils/helperFunctions/SeaFunctions/isEnemyFleet";
import { SeaMineCaptureEvent } from "./Events/SeaMineCaptureEvent";
import { ArmyMergeEvent } from './Events/ArmyMergeEvent';
import { usePlayerIsValid } from '../../hooks/IdentityHooks/usePlayerIsValid';
import { EventProgressBar } from '../ProgressComp/EventProgressBar';
import { FleetLoadEvent } from './Events/FleetLoadEvent';

export const Terrain = ({ zoomLevel, isSpectator }: { zoomLevel: number, isSpectator: boolean }) => {
  const { components, systemCalls } = useMUD();
  const { width, height } = useTerrain();

  const values: Array<Array<TerrainType>> = map;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const { gameID } = useGame();

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
    setIsArmySettleStage,
    setIsArmyUpdateStage,
    isArmyUpdateStage,
    setArmyPositionUpdate,
    setIsArmyMergeStage,
    isArmyMergeStage,
    setMergeTargetArmyPosition,
    setMergeFromArmyPosition } = useArmy();

  const { userWallet } = usePlayer();

  const { isCastleSettled,
    setIsCastleSettled,
    setTempCastle,
    setCastlePosition } = useCastle();

  const { isMineStage,
    setIsMineStage,
    setTargetMinePosition,
    setAttackerArmyPosition } = useMine();

  const { dockSettleStage,
    setDockSettleStage,
    setArmyPositionToSettleDock,
    setDockPosition,
    setDockCaptureStage,
    setTargetDockPosition,
    setDockAttackerArmyPosition,
    dockCaptureStage,
    setSeaMineAttackerFleetPosition,
    setSeaMineStage,
    seaMineStage,
    setTargetSeaMinePosition } = useSea();

  const { fleetSettleStage,
    setFleetSettleStage,
    setDockPositionForFleetSettlement,
    setFleetPosition,
    isFleetMoveStage,
    setIsFleetMoveStage,
    setFromFleetPosition,
    fromFleetPosition,
    setAttackerFleetPosition,
    setTargetFleetPosition,
    setMyFleetConfig,
    setEnemyFleetConfig,
    setIsFleetAttackStage,
    isFleetAttackStage,
    isFleetLoadStage,
    setIsFleetLoadStage,
    setLoadArmyPosition,
    setTargetLoadFleetPosition } = useFleet();

  const { setShowError,
    setErrorMessage,
    setErrorTitle } = useError();

  const movingArmyId = useRef<Entity>("0" as Entity);
  const toArmyPositionRef = useRef<{ x: number, y: number }>({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord | undefined>({ x: "-1", y: "-1" });

  const movingFleetId = useRef<string>("0");
  const toFleetPositionRef = useRef<{ x: number, y: number }>({ x: -1, y: -1 });
  const fromFleetPositionRef = useRef<Coord | undefined>({ x: "-1", y: "-1" });
  const [isLoadingArmy, setIsLoadingArmy] = useState<boolean>(false);
  const [isLoadingFleet, setIsLoadingFleet] = useState<boolean>(false);

  const castlePositions = useCastlePositions(gameID);
  const myCastlePosition = useMyCastlePositions(userWallet, gameID);
  const armyPositions = useArmyPositions(gameID);
  const myArmyPosition = useMyArmy(userWallet, gameID);
  const resources = useResources(gameID);
  const myResourcePositions = useMyResourcePositions(userWallet, gameID);
  const dockPositions = useDockPositions(gameID);
  const myDockPositions = useMyDockPositions(userWallet, gameID)
  const fleetPositions = useFleetPositions(gameID);
  const myFleetPositions = useMyFleetPositions(userWallet, gameID);
  const userValid = usePlayerIsValid(gameID, userWallet);

  const handleClick = async (e: any) => {
    // Toggle orange tiles for army settlement
    if (!isArmyMoveStage && isMyCastle(myCastlePosition, getDataAtrX(e), getDataAtrY(e))) {
      if (isArmySettleStage || isArmyUpdateStage) {
        setIsArmySettleStage(false);
        setIsArmyUpdateStage(false);
      }
      else if (!isArmySettleStage) {
        if (numberOfArmy < (5 + myCastlePosition.length - 1)) {
          setIsArmySettleStage(true);
        }
        setCastlePosition({ x: getDataAtrX(e), y: getDataAtrY(e) })
        setIsArmyUpdateStage(true);
      }
    }

    if (isArmyUpdateStage && isMyArmy({ x: parseInt(getDataAtrX(e)), y: parseInt(getDataAtrY(e)) }, myArmyPosition)) {
      setArmyPositionUpdate({ x: getDataAtrX(e), y: getDataAtrY(e) })
    }

    // Toggle orange tiles for fleet settlement
    if (!isArmyMoveStage && !isFleetMoveStage && isMyDock(Number(getDataAtrX(e)), Number(getDataAtrY(e)), myDockPositions)) {
      if (fleetSettleStage) {
        setFleetSettleStage(false);
      }
      else if (!fleetSettleStage && (myDockPositions && myFleetPositions && myDockPositions.length !== myFleetPositions.length)) {
        setFleetSettleStage(true);
        setDockPositionForFleetSettlement({ x: getDataAtrX(e), y: getDataAtrY(e) })
      }
    }

    // Keep fleet position as temp
    if (fleetSettleStage) {
      setFleetPosition({ x: getDataAtrX(e), y: getDataAtrY(e) })
    }

    // Keep castle position as temp
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    // Keep army position as temp
    if (isArmySettleStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    if (!fromFleetPosition && isMyFleet({ x: getDataAtrX(e), y: getDataAtrY(e) }, myFleetPositions) && !fleetSettleStage && !isArmyMoveStage) {
      setFromFleetPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsFleetMoveStage(true);
      setIsFleetAttackStage(true)
      setSeaMineStage(true)
    } else if (fromFleetPosition && isUserClickedManhattanPosition(fromFleetPosition, getDataAtrX(e), getDataAtrY(e))) {

      toFleetPositionRef.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromFleetPositionRef.current = { x: fromFleetPosition.x.toString(), y: fromFleetPosition.y.toString() };

      if (canFleetBeSettled(values[toFleetPositionRef.current.x][toFleetPositionRef.current.y]) && isEnemyFleet({ x: toFleetPositionRef.current.x, y: toFleetPositionRef.current.y }, myFleetPositions, fleetPositions)) {
        FleetAttackEvent(setIsFleetMoveStage,
          setSeaMineStage,
          setFromFleetPosition,
          setAttackerFleetPosition,
          setTargetFleetPosition,
          fromFleetPositionRef,
          toFleetPositionRef,
          setMyFleetConfig,
          setEnemyFleetConfig,
          myFleetPositions,
          fleetPositions);
      }
      else if (isUserClickedMine(toFleetPositionRef.current.x, toFleetPositionRef.current.y, resources)) {
        SeaMineCaptureEvent(setIsFleetMoveStage,
          setFleetSettleStage,
          setIsFleetAttackStage,
          setFromFleetPosition,
          setSeaMineAttackerFleetPosition,
          fromFleetPositionRef,
          setTargetSeaMinePosition,
          toFleetPositionRef,
          setMyFleetConfig,
          myFleetPositions)
      }
      else if (canFleetBeSettled(values[toFleetPositionRef.current.x][toFleetPositionRef.current.y])) { //Buraya toFleetPosition ın, kendi fleetine ait olup olmadgını check etmek lazım
        await FleetMoveEvent(setIsFleetMoveStage,
          setSeaMineStage,
          setIsFleetAttackStage,
          fromFleetPositionRef,
          toFleetPositionRef,
          isFleetMoveStage,
          fromFleetPosition,
          setFromFleetPosition,
          components,
          movingFleetId,
          systemCalls,
          setErrorMessage,
          setErrorTitle,
          setShowError,
          setIsLoadingFleet,
          gameID);
      }
    }
    else {
      setIsFleetMoveStage(false)
      setSeaMineStage(false)
      setIsFleetAttackStage(false)
      setFromFleetPosition(undefined);
      toFleetPositionRef.current = { x: -1, y: -1 };
      fromFleetPositionRef.current = { x: "-1", y: "-1" };
    }

    // Logic of Army-Castle-Mine-Dock Attack and Dock Settle
    if (!fromArmyPosition && isCastleSettled && !isArmySettleStage && !isArmyUpdateStage && myArmyPosition && isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
      setIsAttackStage(true);
      setIsMineStage(true)
      setDockSettleStage(true);
      setDockCaptureStage(true);
      setIsArmyMergeStage(true);
      setIsFleetLoadStage(true);
    }
    else if (fromArmyPosition && isUserClickedManhattanPosition(fromArmyPosition, getDataAtrX(e), getDataAtrY(e))) {
      toArmyPositionRef.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromArmyPositionRef.current = { x: fromArmyPosition.x, y: fromArmyPosition.y, };

      if (isEnemyArmy(toArmyPositionRef.current, armyPositions, myArmyPosition)) {
        ArmyAttackEvent(setIsFleetLoadStage,
          setIsArmyMergeStage,
          setIsArmyMoveStage,
          setIsMineStage,
          setDockSettleStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setAttackFromArmyPositionToArmy,
          setAttackToArmyPositionToArmy,
          fromArmyPositionRef,
          toArmyPositionRef,
          setMyArmyConfig,
          setEnemyArmyConfig,
          myArmyPosition,
          armyPositions);
      }
      else if (isEnemyCastle(toArmyPositionRef.current, myCastlePosition, castlePositions)) {
        CastleAttackEvent(setIsFleetLoadStage,
          setIsArmyMergeStage,
          setIsArmyMoveStage,
          setIsMineStage,
          setDockSettleStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setAttackFromArmyPositionToCastle,
          setAttackToArmyPositionToCastle,
          fromArmyPositionRef,
          toArmyPositionRef,
          setMyArmyConfig,
          myArmyPosition)
      }
      else if (isUserClickedMine(toArmyPositionRef.current.x, toArmyPositionRef.current.y, resources) &&
        canCastleBeSettle(values[toArmyPositionRef.current.x][toArmyPositionRef.current.y])) {
        MineCaptureEvent(setIsFleetLoadStage,
          setIsArmyMergeStage,
          setIsArmyMoveStage,
          setIsAttackStage,
          setDockSettleStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setAttackerArmyPosition,
          fromArmyPositionRef,
          setTargetMinePosition,
          toArmyPositionRef,
          setMyArmyConfig,
          myArmyPosition);
      }
      else if (isEnemyDock(toArmyPositionRef.current, dockPositions, myDockPositions)) {
        DockCaptureEvent(setIsFleetLoadStage,
          setIsArmyMoveStage,
          setIsAttackStage,
          setDockSettleStage,
          setIsMineStage,
          setFromArmyPosition,
          setDockAttackerArmyPosition,
          fromArmyPositionRef,
          setTargetDockPosition,
          toArmyPositionRef,
          setMyArmyConfig,
          myArmyPosition)
      }
      else if (isPositionNextToSea(toArmyPositionRef.current.x, toArmyPositionRef.current.y, values) &&
        isMyArmy({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }, myArmyPosition) &&
        getNumberOfSoldierInArmy(fromArmyPositionRef.current, myArmyPosition) >= 20) {
        DockSettleEvent(setIsFleetLoadStage,
          setIsMineStage,
          setIsAttackStage,
          setIsArmyMoveStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setArmyPositionToSettleDock,
          fromArmyPositionRef,
          setDockPosition,
          toArmyPositionRef);
      }
      else if (isMyArmy({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }, myArmyPosition) &&
        isMyArmy({ x: toArmyPositionRef.current.x, y: toArmyPositionRef.current.y }, myArmyPosition)) {
        ArmyMergeEvent(setIsFleetLoadStage,
          setIsAttackStage,
          setIsArmyMoveStage,
          setIsMineStage,
          setDockSettleStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setMergeTargetArmyPosition,
          setMergeFromArmyPosition,
          fromArmyPositionRef,
          toArmyPositionRef)
      }
      else if (isMyArmy({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }, myArmyPosition) &&
        isMyFleet({ x: toArmyPositionRef.current.x, y: toArmyPositionRef.current.y }, myFleetPositions)) {
        FleetLoadEvent(setIsAttackStage,
          setIsArmyMoveStage,
          setIsMineStage,
          setDockSettleStage,
          setDockCaptureStage,
          setFromArmyPosition,
          setLoadArmyPosition,
          setTargetLoadFleetPosition,
          fromArmyPositionRef,
          toArmyPositionRef)
      }
      else if (canCastleBeSettle(values[toArmyPositionRef.current.x][toArmyPositionRef.current.y]) &&
        canCastleBeSettle(values[fromArmyPositionRef.current.x][fromArmyPositionRef.current.y]) &&
        !isMyCastle(myCastlePosition, toArmyPositionRef.current.x, toArmyPositionRef.current.y) &&
        !isMyDock(Number(toArmyPositionRef.current.x), Number(toArmyPositionRef.current.y), myDockPositions)) {
        await ArmyMoveEvent(setIsFleetLoadStage,
          setIsArmyMergeStage,
          setIsAttackStage,
          setIsMineStage,
          setDockSettleStage,
          setDockCaptureStage,
          fromArmyPositionRef,
          setIsArmyMoveStage,
          toArmyPositionRef,
          isArmyMoveStage,
          fromArmyPosition,
          setFromArmyPosition,
          components,
          movingArmyId,
          systemCalls,
          setErrorMessage,
          setErrorTitle,
          setShowError,
          setIsLoadingArmy,
          gameID);
      }
    }
    else {
      setIsArmyMoveStage(false);
      setIsAttackStage(false);
      setIsMineStage(false);
      setDockSettleStage(false);
      setDockCaptureStage(false);
      setIsArmyMergeStage(false);
      setIsFleetLoadStage(false)
      setFromArmyPosition(undefined);
      toArmyPositionRef.current = { x: -1, y: -1 };
      fromArmyPositionRef.current = { x: "-1", y: "-1" };
    }
  };

  CastleEffects(fleetSettleStage,
    myCastlePosition,
    setIsCastleSettled,
    castlePositions,
    isCastleSettled,
    userValid);
  ResourceEffects(values,
    fromFleetPosition,
    seaMineStage,
    myResourcePositions,
    resources,
    isMineStage,
    fromArmyPosition);
  ArmyEffects(isArmyUpdateStage,
    values,
    myCastlePosition,
    dockPositions,
    castlePositions,
    isArmySettleStage,
    armyPositions,
    myArmyPosition,
    setNumberOfArmy,
    myArmyPosition.length,
    resources,
    fleetSettleStage,
    isArmyMergeStage,
    fromArmyPosition);
  AttackEffects(myFleetPositions,
    fleetPositions,
    fromFleetPosition,
    isFleetAttackStage,
    myCastlePosition,
    castlePositions,
    armyPositions,
    myArmyPosition,
    isAttackStage,
    fromArmyPosition);
  HoverEffects(myFleetPositions,
    myDockPositions,
    myResourcePositions,
    myArmyPosition,
    dockPositions,
    fromFleetPosition,
    isFleetMoveStage,
    armyPositions,
    resources,
    numberOfArmy,
    isArmySettleStage,
    castlePositions,
    myCastlePosition,
    values,
    fromArmyPosition,
    isArmyMoveStage,
    fleetSettleStage,
    fleetPositions);
  DockEffects(isArmySettleStage,
    castlePositions,
    resources,
    myArmyPosition,
    armyPositions,
    dockPositions,
    myDockPositions,
    values,
    dockSettleStage,
    dockCaptureStage,
    rows,
    columns,
    fromArmyPosition);
  FleetEffects(myFleetPositions,
    fleetPositions,
    values,
    isFleetLoadStage,
    myArmyPosition,
    fromArmyPosition);

  const terrainContainer = {
    height: "100vh",
    minWidth: "100vh",
    backgroundImage: `url(${gameBgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  }

  return (
    <ScrollContainer
      className="scroll-container"
      style={terrainContainer}>
      <div
        className="inline-grid"
        style={{
          pointerEvents: isSpectator === true ? "none" : "auto",
          transform: `scale(${zoomLevel}) rotateX(60deg) rotateZ(45deg) rotateY(0deg)`,
          transition: "transform 0.2s ease-in-out",
          zIndex: "0",
          backgroundImage: `url(${chaquerMap})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          margin: "750px 1350px",
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
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    handleClick(e);
                  }}
                  className={`
                ${isValidTerrainType(values[row][column]) &&
                    "hoverTileEffect"
                    }`}
                  data-bs-toggle={`${canCastleBeSettle(values[row][column]) &&
                    !isCastleSettled
                    ? "modal" : ""
                    }`}
                  data-bs-target={`${canCastleBeSettle(values[row][column]) &&
                    !isCastleSettled
                    ? "#castleSettleModal" : ""
                    }`}
                ></span>
              );
            });
          })
        }
      </div >
      {isLoadingArmy && <EventProgressBar text={"Soldiers are passing to new position..."} />}
      {isLoadingFleet && <EventProgressBar text={"Ships are passing to new position..."} />}
    </ScrollContainer>
  );
}
