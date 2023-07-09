import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { MapConfig }: ClientComponents
) {

  const initMapDataSystem = async (gameID: number, width: number, height: number, terrain: string) => {
    try {
      const tx = await worldSend("initMapData", [gameID, width, height, terrain])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const settleCastle = async (x:number,y:number,gameID:number)=>{
    try {
      const tx = await worldSend("settleCastle", [x, y, gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx

    } catch (e) {
      console.log(e);
      return null
    }
  }


  const settleArmy = async (x:number,y:number,numSwordsman:number,numArcher:number,numCavalry:number,gameID:number)=> {
    try {
      const tx = await worldSend("settleArmy", [x, y, {numSwordsman,numArcher,numCavalry,gameID}]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx
    } catch (e) {
      console.log(e);
      return null 
    }
  }

  const moveArmy = async (armyID:string,x:number ,y:number ,gameID:number) => {
    try {
      const tx = await worldSend("armyMove", [armyID,x,y,gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const attackToArmy = async (armyOne:string,armyTwo:string,gameID:number) => {
    try {
      const tx = await worldSend("attackToArmy", [armyOne,armyTwo,gameID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx
    } catch (e) {
      console.log(e);
      return null
    }
  }

  const castleCapture = async (armyID:string,castleID:string) => {
    try {
      const tx = await worldSend("captureCastle", [armyID,castleID]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return tx
    } catch (e) {
      console.log(e);
      return null
    }
  }





  return {
    initMapDataSystem,
    settleCastle,
    settleArmy,
    moveArmy,
    attackToArmy,
    castleCapture
  };
}