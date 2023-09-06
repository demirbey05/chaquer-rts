import "../../styles/globals.css";
import { TerrainType } from "../../terrain-helper/types";
import { useEffect, useRef } from "react";
import { Entity } from "@latticexyz/recs";
import { useCastle } from "../../context/CastleContext";
import { useAttack } from "../../context/AttackContext";
import { usePlayer } from "../../context/PlayerContext";
import { useArmy } from "../../context/ArmyContext";
import { useMine } from "../../context/MineContext";
import { useError } from "../../context/ErrorContext";
import { useMUD } from "../../MUDContext";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useMyCastlePositions } from "../../hooks/useMyCastlePositions";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useMyArmy } from "../../hooks/useMyArmy";
import { useResources } from "../../hooks/useResources";
import { useMyResourcePositions } from "../../hooks/useMyResourcePositions";
import { findIDFromPosition, Coord } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { getTerrainAsset } from '../../utils/helperFunctions/CustomFunctions/getTerrainAsset';
import { isMyCastle } from '../../utils/helperFunctions/CastleFunctions/isMyCastle';
import { isUserClickedManhattanPosition } from '../../utils/helperFunctions/CustomFunctions/isUserClickedManhattanPosition';
import { getDataAtrY, getDataAtrX } from "../../utils/helperFunctions/CustomFunctions/getIdDataAtr";
import { canCastleBeSettle } from "../../utils/helperFunctions/CastleFunctions/canCastleBeSettle";
import { isMyArmy } from "../../utils/helperFunctions/ArmyFunctions/isMyArmy";
import { isEnemyArmy } from "../../utils/helperFunctions/ArmyFunctions/isEnemyArmy";
import { getMyArmyConfigByPosition, getEnemyArmyConfigByPosition } from "../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";
import { getManhattanPositions } from "../../utils/helperFunctions/CustomFunctions/getManhattanPositions";
import { isEnemyCastle } from "../../utils/helperFunctions/CastleFunctions/isEnemyCastle";
import { isMyResource } from "../../utils/helperFunctions/ResourceFuntions/isMyResource";
import { isUserClickedMine } from "../../utils/helperFunctions/ResourceFuntions/isUserClickedMine";
import MapImg from '../../images/map.png';
import { isResourcePosition } from "../../utils/helperFunctions/ResourceFuntions/isResourcePosition";
import { isCastlePosition } from "../../utils/helperFunctions/CastleFunctions/isCastlePosition";
import { isArmyPosition } from "../../utils/helperFunctions/ArmyFunctions/isArmyPosition";
import { armySettlePositions } from "../../utils/helperFunctions/ArmyFunctions/armySettlePositions";
import { isManhattanPosition } from "../../utils/helperFunctions/CustomFunctions/isManhattanPosition";
import { useDockPositions } from "../../hooks/useDockPositions";
import { useMyDockPositions } from "../../hooks/useMyDockPositions";
import { useSea } from "../../context/SeaContext";
import { isPositionNextToSea } from "../../utils/helperFunctions/SeaFunctions/isPositionNextToSea";

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

  const { components, systemCalls } = useMUD();
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
  const { isCastleSettled, setIsCastleSettled, setTempCastle } = useCastle();
  const { isMineStage, setIsMineStage, setTargetMinePosition, setAttackFromArmyPositionToMine } = useMine();
  const { dockSettleStage, setDockSettleStage, setArmyPositionToSettleDock, armyPositionToSettleDock, setDockPosition, dockPosition } = useSea();
  const { setShowError, setErrorMessage, setErrorTitle } = useError();

  const movingArmyId = useRef<Entity>("0" as Entity);
  const toArmyPositionRef = useRef({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord>({ x: "-1", y: "-1" });

  const castlePositions = useCastlePositions();
  const myCastlePosition = useMyCastlePositions(userWallet);
  const armyPositions = useArmyPositions()[0];
  const myArmyPosition: any = useMyArmy(userWallet)[0];
  const myArmyNumber = useMyArmy(userWallet)[1];
  const resources = useResources();
  const myResourcePositions = useMyResourcePositions(userWallet);
  const dockPositions = useDockPositions();
  const myDockPositions = useMyDockPositions(userWallet)

  // Handle Clicks
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

    //Logic of ArmyMove-ArmyAttack-CastleAttack
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

      //If user attack to the enemy army
      if (isEnemyArmy(toArmyPositionRef.current, armyPositions, myArmyPosition)) {
        setIsArmyMoveStage(false);
        setIsMineStage(false)
        setDockSettleStage(false);
        setFromArmyPosition(undefined);
        setAttackFromArmyPositionToArmy(fromArmyPositionRef.current);
        setAttackToArmyPositionToArmy(toArmyPositionRef.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
        );
        setEnemyArmyConfig(
          getEnemyArmyConfigByPosition(
            { x: toArmyPositionRef.current.x, y: toArmyPositionRef.current.y }, armyPositions)
        );
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      //If user attack to the enemy castle
      else if (isEnemyCastle(toArmyPositionRef.current, myCastlePosition, castlePositions)) {
        setIsArmyMoveStage(false)
        setIsMineStage(false)
        setDockSettleStage(false)
        setFromArmyPosition(undefined);
        setAttackFromArmyPositionToCastle(fromArmyPositionRef.current);
        setAttackToArmyPositionToCastle(toArmyPositionRef.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
        );
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      //If user capture the mine
      else if (isUserClickedMine(toArmyPositionRef.current.x, toArmyPositionRef.current.y, resources)) {
        setIsArmyMoveStage(false)
        setIsAttackStage(false)
        setDockSettleStage(false)
        setFromArmyPosition(undefined);
        setAttackFromArmyPositionToMine(fromArmyPositionRef.current);
        setTargetMinePosition(toArmyPositionRef.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
        );
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      // If user settle a dock
      else if (isPositionNextToSea(toArmyPositionRef.current.x, toArmyPositionRef.current.y, values) && isMyArmy({ x: parseInt(fromArmyPositionRef.current.x), y: parseInt(fromArmyPositionRef.current.y) }, myArmyPosition)) {
        setIsMineStage(false)
        setIsArmyMoveStage(false)
        setIsAttackStage(false)
        setFromArmyPosition(undefined)
        setArmyPositionToSettleDock(fromArmyPositionRef.current)
        setDockPosition(toArmyPositionRef.current)
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      else {
        if (canCastleBeSettle(values[toArmyPositionRef.current.x][toArmyPositionRef.current.y])) {
          setIsAttackStage(false)
          setIsMineStage(false)
          setDockSettleStage(false);

          const movingArmyIdMap = findIDFromPosition(
            fromArmyPositionRef.current,
            components.Position
          );

          if (movingArmyIdMap !== null) {
            movingArmyId.current = [...movingArmyIdMap][0];
          }

          setIsArmyMoveStage(false);

          if (toArmyPositionRef.current && isArmyMoveStage) {
            const tx = await systemCalls.moveArmy(
              movingArmyId.current,
              toArmyPositionRef.current.x,
              toArmyPositionRef.current.y,
              1
            )
            if (tx == null) {
              setErrorMessage("An error occurred while trying to move army.")
              setErrorTitle("Army Move Error")
              setShowError(true)
              return
            }

            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.innerHTML = "";
            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";

            setFromArmyPosition(undefined);
            toArmyPositionRef.current = { x: -1, y: -1 };
            fromArmyPositionRef.current = { x: "-1", y: "-1" };
          }
        }
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

  // Check if castle settled before and deploy castle emojis
  useEffect(() => {
    //Checks that if the user has already settled the castle
    if (myCastlePosition && myCastlePosition.length > 0) {
      myCastlePosition.map((position: any) => {
        document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
      });
      setIsCastleSettled(true);
    }

    return () => {
      if (myCastlePosition && myCastlePosition.length > 0) {
        myCastlePosition.map((position: any) => {
          if (document.getElementById(`${position.y},${position.x}`)) {
            document.getElementById(`${position.y},${position.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
          }
        });
      }
    };
  }, [myCastlePosition]);

  //Puts the castle emojis to castle positions
  useEffect(() => {
    if (castlePositions) {
      castlePositions.map(
        (data) => {
          document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰";
          document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none";
        }
      );
    }
  }, [castlePositions])

  // Make castles unclickable during castle settlement
  useEffect(() => {
    if (castlePositions && !isCastleSettled) {
      castlePositions.map(
        (data) => {
          document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none";
        }
      );
    }

    if (isCastleSettled) {
      castlePositions.map(
        (data) => {
          document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "auto";
        }
      );
    }
  }, [castlePositions, isCastleSettled])

  // Deploy resource emojis
  useEffect(() => {
    if (myResourcePositions) {
      myResourcePositions.map((position: any) => {
        document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
      })
    }

    if (resources) {
      resources.map(data => {
        if (data.resource.sourceType === 0) {
          document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🌽";
        }
        else if (data.resource.sourceType === 1) {
          document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "🪓";
        }
        else {
          document.getElementById(`${data.positions.y},${data.positions.x}`)!.innerHTML = "⛏️";
        }
      })
    }

    return () => {
      if (myResourcePositions) {
        myResourcePositions.map((position: any) => {
          if (document.getElementById(`${position.y},${position.x}`)) {
            document.getElementById(`${position.y},${position.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
          }
        });
      }
    };
  }, [myResourcePositions])

  //Makes castle, army and resource positions unClickable to not cause bug during army settlement
  useEffect(() => {
    if (castlePositions && isArmySettleStage) {
      castlePositions.map((data) => {
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
      });
    }

    if (armyPositions && isArmySettleStage) {
      armyPositions.map((data) => {
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
      });
    }

    if (resources && isArmySettleStage) {
      resources.map((data) => {
        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
      });
    }
  }, [isArmySettleStage, castlePositions, armyPositions, resources]);

  // Deploy army emojis to position. Add border for user's army.
  useEffect(() => {
    const clearBoard = () => {
      const boardElements = document.getElementsByClassName("army-emoji");
      Array.from(boardElements).forEach((element: any) => {
        element.innerHTML = "";
        element.style.border = "0.5px solid rgba(0, 0, 0, 0.1)"; // Clear the border
      });
    };

    if (myArmyPosition) {
      // Clear the board before redeploying army emojis
      clearBoard();

      myArmyPosition.forEach((data: any) => {
        const element = document.getElementById(
          `${data.position.y},${data.position.x}`
        )!;
        element.innerHTML = "⚔️";
        element.style.border = "2px solid rgb(245, 169, 6)";
      });
    }

    setNumberOfArmy(myArmyNumber);

    //Puts the army emojis to army positions
    armyPositions.map((data: any) => {
      document.getElementById(
        `${data.position.y},${data.position.x}`
      )!.innerHTML = "⚔️";
      document
        .getElementById(`${data.position.y},${data.position.x}`)
        ?.classList.add("army-emoji");
    });
  }, [armyPositions, myArmyPosition]);

  // Handle Army and Castle Attack OffCanvas
  useEffect(() => {
    armyPositions.map((data: any) => {
      if (isAttackStage && fromArmyPosition) {
        isManhattanPosition(data.position, fromArmyPosition.x, fromArmyPosition.y) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "offcanvas");

        isManhattanPosition(data.position, fromArmyPosition.x, fromArmyPosition.y) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "#armyAttackDrawer");
      }
    });

    castlePositions.map((data: any) => {
      if (isAttackStage && fromArmyPosition) {
        isManhattanPosition(data, fromArmyPosition.x, fromArmyPosition.y) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        isManhattanPosition(data, fromArmyPosition.x, fromArmyPosition.y) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "#castleAttackDrawer");
      }
    });

    return () => {
      if (castlePositions.length > 0) {
        castlePositions.map((data: any) => {
          if (document.getElementById(`${data.y},${data.x}`) !== null) {
            document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
            document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
          }
        });
      }

      if (armyPositions.length > 0) {
        armyPositions.map((data: any) => {
          if (document.getElementById(`${data.position.y},${data.position.x}`) !== null) {
            document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
            document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
          }
        })
      }
    }
  }, [isAttackStage]);

  // Handle Mine Capture OffCanvas
  useEffect(() => {
    resources.map((data: any) => {
      if (isMineStage && fromArmyPosition) {
        isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
          !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
          document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        isManhattanPosition(data.positions, fromArmyPosition.x, fromArmyPosition.y) &&
          !isMyResource(data.positions.x, data.positions.y, myResourcePositions) &&
          document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "#mineCaptureDrawer");
      }
    });

    return () => {
      if (resources) {
        resources.map((data: any) => {
          if (document.getElementById(`${data.positions.y},${data.positions.x}`) !== null) {
            document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-toggle", "");
            document.getElementById(`${data.positions.y},${data.positions.x}`)!.setAttribute("data-bs-target", "");
          }
        });
      }
    }
  }, [isMineStage])

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      getManhattanPositions({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data) => {
        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
          canCastleBeSettle(values[data.x][data.y]) &&
            !isCastlePosition(data.x, data.y, myCastlePosition) &&
            !props.isBorder &&
            document.getElementById(`${data.y},${data.x}`)?.classList.add("blueTileEffect");

          if (isCastlePosition(data.x, data.y, myCastlePosition)) {
            document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none"
          }
        }
      });

    }

    return () => {
      if (fromArmyPosition) {
        getManhattanPositions({
          x: parseInt(fromArmyPosition.x),
          y: parseInt(fromArmyPosition.y),
        }).map((data) => {
          if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
            if (canCastleBeSettle(values[data.x][data.y])) {
              document.getElementById(`${data.y},${data.x}`)?.classList.remove("blueTileEffect");
            }

            if (isCastlePosition(data.x, data.y, myCastlePosition)) {
              document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "auto"
            }
          }
        });
      }
    }
  }, [fromArmyPosition, isArmyMoveStage, myCastlePosition]);

  //Orange hover effect and data-bs assign when user deploys an army
  useEffect(() => {
    if (isArmySettleStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              if (
                numberOfArmy !== 5 &&
                !props.isBorder &&
                !isResourcePosition(data.x, data.y, resources) &&
                !isCastlePosition(data.x, data.y, castlePositions) &&
                !isArmyPosition(data.x, data.y, armyPositions) &&
                armySettlePositions(data.x, data.y, myCastlePosition)
              ) {
                const element = document.getElementById(`${data.y},${data.x}`)!;
                if (element) {
                  element.classList.add("orangeTileEffect");
                  element.setAttribute("data-bs-toggle", "modal");
                  element.setAttribute("data-bs-target", "#armySettleModal");
                }
              }
            }
          }
        );
      });
    } else if (!isArmySettleStage && myCastlePosition && numberOfArmy !== 5) {
      myCastlePosition.map((position: any) => {
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              if (armySettlePositions(data.x, data.y, myCastlePosition)) {
                document.getElementById(`${data.y},${data.x}`)?.classList.remove("orangeTileEffect")
                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-toggle", "");
                document.getElementById(`${data.y},${data.x}`)?.setAttribute("data-bs-target", "");
              }
            }
          }
        );
      });
    }
  }, [isArmySettleStage, myCastlePosition]);

  /* Deploy dock emojis */
  useEffect(() => {
    if (dockPositions && dockPositions.length > 0) {
      dockPositions.map(
        (data) => {
          document.getElementById(`${data.y},${data.x}`)!.innerHTML = "⚓";
        }
      );
    }
  }, [dockPositions])

  /* Check my dock positions and add borders */
  useEffect(() => {
    if (myDockPositions && myDockPositions.length > 0) {
      myDockPositions.map((position: any) => {
        document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
      });
    }

    return () => {
      if (myDockPositions && myDockPositions.length > 0) {
        myDockPositions.map((position: any) => {
          if (document.getElementById(`${position.y},${position.x}`)) {
            document.getElementById(`${position.y},${position.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
          }
        });
      }
    }
  }, [myDockPositions])

  /* Assign data-bs-toggle ve data-bs-target attributes to possible dock positions */
  useEffect(() => {
    if (values && dockSettleStage) {
      rows.forEach((row) => {
        columns.forEach((column) => {
          const element = document.getElementById(`${column},${row}`);
          if (element && isPositionNextToSea(row, column, values)) {
            const position = { x: row, y: column };
            const isPositionOccupied = isArmyPosition(position.x, position.y, armyPositions) ||
              isMyArmy(position, myArmyPosition) ||
              isResourcePosition(position.x, position.y, resources) ||
              isCastlePosition(position.x, position.y, castlePositions)

            if (!isPositionOccupied) {
              console.log("Attribute verildi")
              element.setAttribute("data-bs-toggle", "modal");
              element.setAttribute("data-bs-target", "#dockSettleModal");
            } else {
              // If it was previously assigned, remove the attributes
              console.log("Attribute çıkarıldı")
              element.removeAttribute("data-bs-toggle");
              element.removeAttribute("data-bs-target");
            }
          }
        });
      });
    }
  }, [values, rows, columns, armyPositions, resources, castlePositions, dockSettleStage, myArmyPosition]);

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
                  canCastleBeSettle(values[row][column]) &&
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
