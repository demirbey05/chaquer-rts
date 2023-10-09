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
    try {
      const tx = await worldContract.write.initUsername([username]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const settleCastle = async (x: number, y: number, gameID: number) => {
    try {
      const tx = await worldContract.write.settleCastle([x, y, BigInt(gameID)]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
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
    try {
      const tx = await worldContract.write.settleArmy([
        x,
        y,
        { numSwordsman, numArcher, numCavalry, gameID },
        castleID,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const moveArmy = async (
    armyID: string,
    x: number,
    y: number,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.armyMove([
        armyID,
        x,
        y,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const attackToArmy = async (
    armyOne: string,
    armyTwo: string,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.attackToArmy([
        armyOne,
        armyTwo,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const castleCapture = async (armyID: string, castleID: string) => {
    try {
      const tx = await worldContract.write.captureCastle([armyID, castleID]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const joinGame = async (gameID: number) => {
    try {
      const tx = await worldContract.write.joinGame([BigInt(gameID)]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const commitSeed = async (gameID: number, seed: number) => {
    try {
      const tx = await worldContract.write.commitSeed([
        BigInt(gameID),
        BigInt(seed),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const resourceSystemInit = async (gameID: number) => {
    try {
      const tx = await worldContract.write.resourceSystemInit([BigInt(gameID)]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const captureMine = async (
    armyID: string,
    mineID: string,
    attackerType: number
  ) => {
    try {
      const tx = await worldContract.write.captureMine([
        armyID,
        mineID,
        attackerType,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const sellResource = async (
    gameID: number,
    amount: number,
    mineType: number
  ) => {
    try {
      const tx = await worldContract.write.sellResource([
        BigInt(gameID),
        BigInt(amount),
        mineType,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const claimWinner = async (gameID: number, address: string) => {
    try {
      const tx = await worldContract.write.claimWinner([
        address,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const buildDock = async (
    x: number,
    y: number,
    armyID: string,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.buildDock([
        x,
        y,
        armyID,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const captureDock = async (armyID: string, dockID: string) => {
    try {
      const tx = await worldContract.write.captureDock([armyID, dockID]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
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
    try {
      const tx = await worldContract.write.settleFleet([
        x,
        y,
        dockID,
        {
          numSmall,
          numMedium,
          numBig,
          gameID,
        },
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const moveFleet = async (fleetID: string, x: number, y: number) => {
    try {
      const tx = await worldContract.write.moveFleet([fleetID, x, y]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const attackFleet = async (
    fleetOne: string,
    fleetTwo: string,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.attackFleet([
        fleetOne,
        fleetTwo,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const buyResource = async (
    gameID: number,
    amount: number,
    mineType: number
  ) => {
    try {
      const tx = await worldContract.write.buyResource([
        BigInt(gameID),
        BigInt(amount),
        mineType,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const exitGame = async (gameID: number) => {
    try {
      const tx = worldContract.write.exitGame([BigInt(gameID)]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const updateArmy = async (
    armyID: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number,
    castleID: string,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.updateArmy([
        armyID,
        {
          numSwordsman,
          numArcher,
          numCavalry,
          gameID: BigInt(gameID),
        },
        castleID,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const mergeArmy = async (
    armyOneID: string,
    armyTwoID: string,
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.mergeArmy([
        armyOneID,
        armyTwoID,
        BigInt(gameID),
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const sendMessage = async (gameID: number, message: string) => {
    try {
      const tx = await worldContract.write.sendMessage([
        BigInt(gameID),
        message,
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const collectResource = async (gameID: number) => {
    try {
      const tx = await worldContract.write.collectResource([BigInt(gameID)]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
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
