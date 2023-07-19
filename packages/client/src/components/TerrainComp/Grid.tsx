import "../../styles/globals.css";
import { useEffect, useState, useRef } from "react";
import { TerrainType } from "../../terrain-helper/types";
import { useCastle } from "../../context/CastleContext";
import { CastleSettleModal } from "../CastleComp/CastleSettleModal";
import { ArmySettleModal } from "../ArmyComp/ArmySettleModal";
import { ArmyAttackModal } from "../ArmyComp/ArmyAttackModal";
import { CastleAttackModal } from "../CastleComp/CastleAttackModal";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";
import { useArmyPositions } from "../../hooks/useArmyPositions";
import { useMyArmy } from "../../hooks/useMyArmy";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition, Coord } from "../../utils/armyID";
import { getTerrainAsset } from '../../utils/getTerrainAsset';
import { isMyCastle } from '../../utils/isMyCastle';
import { isUserClickedManhattanPosition } from '../../utils/isUserClickedManhattanPosition';
import { getDataAtrY, getDataAtrX } from "../../utils/getIdDataAtr";
import { canCastleBeSettle } from "../../utils/canCastleBeSettle";
import { isMyArmy } from "../../utils/isMyArmy";
import { isEnemyArmy } from "../../utils/isEnemyArmy";
import { getMyArmyConfigByPosition, getEnemyArmyConfigByPosition } from "../../utils/getArmyConfigByPosition";
import { getManhattanPositions } from "../../utils/getManhattanPositions";
import { isEnemyCastle } from "../../utils/isEnemyCastle";
import { useArmy } from "../../context/ArmyContext";
import { useAttack } from "../../context/AttackContext";
import { Entity } from "@latticexyz/recs";
import { usePlayer } from "../../context/PlayerContext";
import { useResourcePositions } from "../../hooks/useResourcePositions";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

export const Grid = (data: DataProp) => {
  const width = data.width;
  const height = data.height;
  const values = data.values;
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
    isArmyStage,
    setArmyPosition,
    setNumberOfArmy,
    numberOfArmy,
    setIsArmyStage } = useArmy();
  const { userWallet } = usePlayer();
  const { isCastleSettled, setIsCastleSettled, setTempCastle } = useCastle();

  const [tempArmyPos, setTempArmyPos] = useState<any>();
  const movingArmyId = useRef<Entity>("0" as Entity);
  const toArmyPositionRef = useRef({ x: -1, y: -1 });
  const fromArmyPositionRef = useRef<Coord>({ x: "-1", y: "-1" });

  const castlePositions = useCastlePositions();
  const myCastlePosition = useCastlePositionByAddress(userWallet!.address.toLocaleLowerCase());
  const armyPositions: any = useArmyPositions()[0];
  const myArmyPosition: any = useMyArmy(userWallet!.address.toLocaleLowerCase())[0];
  const myArmyNumber = useMyArmy(userWallet!.address.toLocaleLowerCase())[1];
  //const resourcePositions = useResourcePositions();
  //const myResourcePositions = useResourcePositionByAddress(userWallet!.address.toLocaleLowerCase());
  //console.log(resourcePositions);
  //console.log(myResourcePositions)

  // Handle Clicks
  const handleClick = async (e: any) => {
    // For Putting army Grid with clicking castle
    if (!isArmyMoveStage && isMyCastle(myCastlePosition, getDataAtrX(e), getDataAtrY(e))) {
      if (isArmyStage) {
        setIsArmyStage(false);
      }
      else if (!isArmyStage && numberOfArmy < 3) {
        setIsArmyStage(true);
      }
    }

    // Keep castle position as temp
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    // Keep army position as temp
    if (isArmyStage) {
      setArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }

    //Logic of ArmyMove-ArmyAttack-CastleAttack
    if (!fromArmyPosition && isCastleSettled && !isArmyStage && myArmyPosition && isMyArmy({ x: getDataAtrX(e), y: getDataAtrY(e) }, myArmyPosition)) {
      setFromArmyPosition({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setTempArmyPos({ x: getDataAtrX(e), y: getDataAtrY(e) });
      setIsArmyMoveStage(true);
      setIsAttackStage(true);
    }
    else if (fromArmyPosition && isUserClickedManhattanPosition(fromArmyPosition, getDataAtrX(e), getDataAtrY(e))) {
      toArmyPositionRef.current = { x: getDataAtrX(e), y: getDataAtrY(e) };
      fromArmyPositionRef.current = { x: fromArmyPosition.x, y: fromArmyPosition.y, };

      //If user attack to the enemy army
      if (isEnemyArmy(toArmyPositionRef.current, armyPositions, myArmyPosition)) {
        setIsArmyMoveStage(false);
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
        setFromArmyPosition(undefined);
        setAttackFromArmyPositionToCastle(fromArmyPositionRef.current);
        setAttackToArmyPositionToCastle(toArmyPositionRef.current);
        setMyArmyConfig(
          getMyArmyConfigByPosition({ x: fromArmyPositionRef.current.x, y: fromArmyPositionRef.current.y, }, myArmyPosition)
        );
        toArmyPositionRef.current = { x: -1, y: -1 };
        fromArmyPositionRef.current = { x: "-1", y: "-1" };
      }
      else {
        if (canCastleBeSettle(values[toArmyPositionRef.current.x][toArmyPositionRef.current.y])) {
          setIsAttackStage(false)
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
              console.log("Error occured in moving army.")
              return
            }
            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.innerHTML = "";
            document.getElementById(`${fromArmyPosition.y},${fromArmyPosition.x}`)!.style.border = "";

            setIsAttackStage(false);
            setFromArmyPosition(undefined);
            toArmyPositionRef.current = { x: -1, y: -1 };
            fromArmyPositionRef.current = { x: "-1", y: "-1" };
          }
        }
      }
    }
    else {
      setFromArmyPosition(undefined);
      toArmyPositionRef.current = { x: -1, y: -1 };
      fromArmyPositionRef.current = { x: "-1", y: "-1" };
      setIsArmyMoveStage(false);
      setIsAttackStage(false);
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

    if (castlePositions) {
      //Puts the castle emojis to castle positions
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰")
      );
    }

    return () => {
      if (myCastlePosition && myCastlePosition.length > 0) {
        myCastlePosition.map((position: any) => {
          if (document.getElementById(`${position.y},${position.x}`)) {
            document.getElementById(`${position.y},${position.x}`)!.style.border = "";
          }
        });
      }
    };
  }, [castlePositions, myCastlePosition]);

  //Makes castle position unClickable to not cause bug during army settlement
  useEffect(() => {
    if (castlePositions) {
      castlePositions.map((data) => {
        document
          .getElementById(`${data.y},${data.x}`)!
          .setAttribute("data-bs-toggle", "");
      });
    }
  }, [isArmyStage, castlePositions]);

  // Deploy army emojis to position. Add border for user's army.
  useEffect(() => {
    const clearBoard = () => {
      const boardElements = document.getElementsByClassName("army-emoji");
      Array.from(boardElements).forEach((element: any) => {
        element.innerHTML = "";
        element.style.border = ""; // Clear the border
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

    //Puts the castle emojis to castle positions
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
        // Set data-bs-toggle for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.position.x) && position.y === parseInt(data.position.y))
        }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        // Set data-bs-target for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.position.x) && position.y === parseInt(data.position.y))
        }) &&
          !isMyArmy({ x: data.position.x, y: data.position.y }, myArmyPosition) &&
          document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "#offcanvasBottom");
      }
    });

    castlePositions.map((data: any) => {
      if (isAttackStage && fromArmyPosition) {
        // Set data-bs-toggle for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.x) && position.y === parseInt(data.y))
        }) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "offcanvas");
        // Set data-bs-target for army
        getManhattanPositions({ x: parseInt(fromArmyPosition.x), y: parseInt(fromArmyPosition.y) }).some((position: any) => {
          return (position.x === parseInt(data.x) && position.y === parseInt(data.y))
        }) &&
          isEnemyCastle({ x: data.x, y: data.y }, myCastlePosition, castlePositions) &&
          document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "#offcanvasBottomCastle");
      }
    });

    return () => {
      castlePositions.map((data: any) => {
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.y},${data.x}`)!.setAttribute("data-bs-target", "");
      });

      armyPositions.map((data: any) => {
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${data.position.y},${data.position.x}`)!.setAttribute("data-bs-target", "");
      })
    }
  }, [isAttackStage]);

  //Blue hover effect when user moves an army
  useEffect(() => {
    if (fromArmyPosition && isArmyMoveStage) {
      getManhattanPositions({
        x: parseInt(fromArmyPosition.x),
        y: parseInt(fromArmyPosition.y),
      }).map((data) => {
        if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
          canCastleBeSettle(values[data.x][data.y]) && !myCastlePosition.find((element: { x: number; y: number }) => {
            return (
              element.x == data.x &&
              element.y == data.y
            );
          }) &&
            document
              .getElementById(`${data.y},${data.x}`)
              ?.classList.add("borderHoverMove");

          myCastlePosition.find((element: { x: number; y: number }) => {
            document.getElementById(`${element.y},${element.x}`)!.style.pointerEvents = "none"
          })
        }
      });

    } else {
      if (tempArmyPos) {
        getManhattanPositions({
          x: parseInt(tempArmyPos.x),
          y: parseInt(tempArmyPos.y),
        }).map((data) => {
          if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
            canCastleBeSettle(values[data.x][data.y]) &&
              document
                .getElementById(`${data.y},${data.x}`)
                ?.classList.remove("borderHoverMove");

            myCastlePosition.find((element: { x: number; y: number }) => {
              document.getElementById(`${element.y},${element.x}`)!.style.pointerEvents = "auto"
            })
          }
        });
      }
    }
  }, [fromArmyPosition, isArmyMoveStage]);

  //Orange hover effect when user deploys an army
  useEffect(() => {
    if (isArmyStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              canCastleBeSettle(values[data.x][data.y]) &&
                document.getElementById(`${data.y},${data.x}`)?.classList.add("borderHoverArmy")
            }
          }
        );
      });
    } else if (!isArmyStage && myCastlePosition) {
      myCastlePosition.map((position: any) => {
        getManhattanPositions(position).map(
          (data) => {
            if (data.x >= 0 && data.y >= 0 && data.x < 50 && data.y < 50) {
              canCastleBeSettle(values[data.x][data.y]) &&
                document.getElementById(`${data.y},${data.x}`)?.classList.remove("borderHoverArmy")
            }
          }
        );
      });
    }
  }, [isArmyStage, myCastlePosition, values]);

  return (
    <div className={`inline-grid ${data.isBorder && "border-4 border-black"}`}>
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              id={`${column},${row}`}
              data-row={`${row}`}
              data-column={`${column}`}
              style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                width: `${data.pixelStyles[1]}px`,
                height: `${data.pixelStyles[1]}px`,
                backgroundImage: `${getTerrainAsset(values[row][column])}`,
                backgroundSize: "cover",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: `${data.isBorder ? "7px" : "20px"}`,
              }}
              onClick={(e) => {
                handleClick(e);
              }}
              className={`
                ${!data.isBorder &&
                canCastleBeSettle(values[row][column]) &&
                "borderHover"
                }`}
              data-bs-toggle={`${canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                ? "modal"
                : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  myCastlePosition.length > 0 &&
                  myCastlePosition &&
                  myCastlePosition.some((position: any) => {
                    return getManhattanPositions(position).some(
                      (item) => item.x === row && item.y === column
                    );
                  })
                  ? "modal"
                  : ""
                }`}
              data-bs-target={`${canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder
                ? "#castleSettleModal"
                : ""
                }${canCastleBeSettle(values[row][column]) &&
                  isCastleSettled &&
                  !data.isBorder &&
                  isArmyStage &&
                  numberOfArmy !== 3 &&
                  myCastlePosition.length > 0 &&
                  myCastlePosition &&
                  myCastlePosition.some((position: any) => {
                    return getManhattanPositions(position).some(
                      (item) => item.x === row && item.y === column
                    );
                  })
                  ? "#armySettleModal"
                  : ""
                }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal />
      <ArmySettleModal />
      <ArmyAttackModal />
      <CastleAttackModal />
    </div >
  );
}
