import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls({
  worldContract,
  waitForTransaction,
}: SetupNetworkResult) {
  const initGame = async (
    capacity: number,
    width: number,
    height: number,
    terrain: string,
    gameName: string,
    mapID: number
  ) => {
    try {
      const txSimulated = await worldContract.simulate.InitGame([
        BigInt(capacity),
        width,
        height,
        terrain,
        gameName,
        mapID,
      ]);

      const tx = await worldContract.write.InitGame([
        BigInt(capacity),
        width,
        height,
        terrain,
        gameName,
        mapID,
      ]);
      await waitForTransaction(tx);

      return txSimulated;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const initUsername = async (username: string) => {
    await worldContract.write
      .initUsername([username])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const settleCastle = async (x: number, y: number, gameID: number) => {
    await worldContract.write
      .settleCastle([x, y, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const settleArmy = async (
    x: number,
    y: number,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number,
    gameID: number,
    castleID: string
  ) => {
    await worldContract.write
      .settleArmy([
        x,
        y,
        { numSwordsman, numArcher, numCavalry, gameID },
        castleID,
      ])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const moveArmy = async (
    armyID: string,
    x: number,
    y: number,
    gameID: number
  ) => {
    await worldContract.write
      .armyMove([armyID, x, y, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const attackToArmy = async (
    armyOne: string,
    armyTwo: string,
    gameID: number
  ) => {
    await worldContract.write
      .attackToArmy([armyOne, armyTwo, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const castleCapture = async (armyID: string, castleID: string) => {
    await worldContract.write
      .captureCastle([armyID, castleID])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const joinGame = async (gameID: number) => {
    await worldContract.write
      .joinGame([BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const commitSeed = async (gameID: number, seed: number) => {
    await worldContract.write
      .commitSeed([BigInt(gameID), BigInt(seed)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const resourceSystemInit = async (gameID: number) => {
    await worldContract.write
      .resourceSystemInit([BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const captureMine = async (
    armyID: string,
    mineID: string,
    attackerType: number
  ) => {
    await worldContract.write
      .captureMine([armyID, mineID, attackerType])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const sellResource = async (
    gameID: number,
    amount: number,
    mineType: number
  ) => {
    await worldContract.write
      .sellResource([BigInt(gameID), BigInt(amount), mineType])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const claimWinner = async (gameID: number, address: string) => {
    await worldContract.write
      .claimWinner([address, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const buildDock = async (
    x: number,
    y: number,
    armyID: string,
    gameID: number
  ) => {
    await worldContract.write
      .buildDock([x, y, armyID, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const captureDock = async (armyID: string, dockID: string) => {
    await worldContract.write
      .captureDock([armyID, dockID])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const settleFleet = async (
    x: number,
    y: number,
    dockID: string,
    numSmall: number,
    numMedium: number,
    numBig: number,
    gameID: number
  ) => {
    await worldContract.write
      .settleFleet([
        x,
        y,
        dockID,
        {
          numSmall,
          numMedium,
          numBig,
          gameID,
        },
      ])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const moveFleet = async (fleetID: string, x: number, y: number) => {
    await worldContract.write
      .moveFleet([fleetID, x, y])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const attackFleet = async (
    fleetOne: string,
    fleetTwo: string,
    gameID: number
  ) => {
    await worldContract.write
      .attackFleet([fleetOne, fleetTwo, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const buyResource = async (
    gameID: number,
    amount: number,
    mineType: number
  ) => {
    await worldContract.write
      .buyResource([BigInt(gameID), BigInt(amount), mineType])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const exitGame = async (gameID: number) => {
    await worldContract.write
      .exitGame([BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const updateArmy = async (
    armyID: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number,
    castleID: string,
    gameID: number
  ) => {
    await worldContract.write
      .updateArmy([
        armyID,
        {
          numSwordsman,
          numArcher,
          numCavalry,
          gameID: BigInt(gameID),
        },
        castleID,
      ])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const mergeArmy = async (
    armyOneID: string,
    armyTwoID: string,
    gameID: number
  ) => {
    await worldContract.write
      .mergeArmy([armyOneID, armyTwoID, BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const sendMessage = async (gameID: number, message: string) => {
    await worldContract.write
      .sendMessage([BigInt(gameID), message])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const collectResource = async (gameID: number) => {
    await worldContract.write
      .collectResource([BigInt(gameID)])
      .then(async (tx) => {
        await waitForTransaction(tx);
        return tx;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  return {
    initGame,
    initUsername,
    settleCastle,
    settleArmy,
    moveArmy,
    attackToArmy,
    castleCapture,
    joinGame,
    commitSeed,
    resourceSystemInit,
    captureMine,
    sellResource,
    claimWinner,
    buildDock,
    captureDock,
    settleFleet,
    moveFleet,
    attackFleet,
    buyResource,
    exitGame,
    updateArmy,
    mergeArmy,
    sendMessage,
    collectResource,
  };
}
