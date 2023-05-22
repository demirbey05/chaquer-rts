import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    ArmyConfig: {
      schema: {
        numSwordsman: "uint32",
        numArcher: "uint32",
        numCavalry: "uint32",
      },
      dataStruct: true,
    },
    ArmyOwnable: "address",
    CastleOwnable: "address",
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
      },
      dataStruct: true,
    },
  },
});
