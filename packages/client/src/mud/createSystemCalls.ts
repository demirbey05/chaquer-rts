import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Entity } from "@latticexyz/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction, publicClient }: SetupNetworkResult,
  { Position }: ClientComponents
) {
  const initMapDataSystem = async (
    gameID: number,
    width: number,
    height: number,
    terrain: string
  ) => {
    try {
      const tx = await worldContract.write.initMapData([
        BigInt(gameID),
        width,
        height,
        terrain,
      ]);
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
    gameID: number
  ) => {
    try {
      const tx = await worldContract.write.settleArmy([
        x,
        y,
        { numSwordsman, numArcher, numCavalry, gameID },
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
    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: armyID as Entity,
      value: { x, y },
    });
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
    } finally {
      Position.removeOverride(positionId);
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

  const joinGame = async (userName: string, gameID: number) => {
    try {
      const tx = await worldContract.write.joinGame([BigInt(gameID), userName]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const InitNumberOfGamer = async (gameID: number, limit: number) => {
    try {
      const tx = await worldContract.write.InitNumberOfGamer([
        BigInt(gameID),
        BigInt(limit),
      ]);
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

  const captureMine = async (armyID: string, mineID: string) => {
    try {
      const tx = await worldContract.write.captureMine([armyID, mineID]);
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

  const updateEconomyData = async (gameID: number) => {
    try {
      const tx = await worldContract.write.updateEconomyData([BigInt(gameID)]);
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
        BigInt(gameID)
      ]);
      await waitForTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return {
    initMapDataSystem,
    settleCastle,
    settleArmy,
    moveArmy,
    attackToArmy,
    castleCapture,
    joinGame,
    commitSeed,
    resourceSystemInit,
    captureMine,
    InitNumberOfGamer,
    sellResource,
    updateEconomyData,
    claimWinner,
  };
}
