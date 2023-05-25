import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  tables: {
    ArmyConfig: {
      schema: {
        numSwordsman: "uint32",
        numArcher: "uint32",
        numCavalry: "uint32",
        gameID: "uint256",
      },
      dataStruct: true,
    },
    ArmyOwnable: {
      schema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    CastleOwnable: {
      schema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    MapConfig: {
      keySchema: {
        gameID: "uint256",
      },
      schema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
      dataStruct: false,
    },
    Position: {
      schema: {
        x: "uint32",
        y: "uint32",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    CastleSiegeResult:{
      schema:{
        winner:"address",
        loser:"address"
      },
      ephemeral:true,
    },
    BattleResult:{
      schema:{
        winner:"address",
        loser:"address",
        isDraw:"bool",
      },
      ephemeral:true
    }
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("CastleOwnable")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("ArmyOwnable")],
    },
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("ArmyOwnable")],
    }
  ],
});
