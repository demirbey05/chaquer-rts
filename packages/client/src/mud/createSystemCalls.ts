import { awaitStreamValue, uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Entity } from "@latticexyz/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$ }: SetupNetworkResult,
  { Position }: ClientComponents
) {
  const initMapDataSystem = async (
    gameID: number,
    width: number,
    height: number,
    terrain: string
  ) => {
    try {
      const tx = await worldSend("initMapData", [
        gameID,
        width,
        height,
        terrain,
      ]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const settleCastle = async (x: number, y: number, gameID: number) => {
    try {
      const tx = await worldSend("settleCastle", [x, y, gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
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
      const tx = await worldSend("settleArmy", [
        x,
        y,
        { numSwordsman, numArcher, numCavalry, gameID },
      ]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
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
      const tx = await worldSend("armyMove", [armyID, x, y, gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
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
      const tx = await worldSend("attackToArmy", [armyOne, armyTwo, gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const castleCapture = async (armyID: string, castleID: string) => {
    try {
      const tx = await worldSend("captureCastle", [armyID, castleID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const joinGame = async (userName: string, gameID: number) => {
    try {
      const tx = await worldSend("joinGame", [gameID, userName]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const InitNumberOfGamer = async (gameID: number, limit: number) => {
    try {
      const tx = await worldSend("InitNumberOfGamer", [gameID, limit]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const commitSeed = async (gameID: number, seed: number) => {
    try {
      const tx = await worldSend("commitSeed", [gameID, seed]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const resourceSystemInit = async (gameID: number) => {
    try {
      const tx = await worldSend("resourceSystemInit", [gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const captureMine = async (armyID: string, mineID: string) => {
    try {
      const tx = await worldSend("captureMine", [armyID, mineID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const collectResource = async (gameID: number) => {
    try {
      const tx = await worldSend("collectResource", [gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
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
    collectResource,
  };
}
