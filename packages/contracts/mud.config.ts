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
    Players:{
      keySchema:{
        gameId:"uint256",
        userAddress:"address"
      } ,schema :{
        userValid:"bool"
      }
    },
    PlayerSeeds:{
      keySchema:{
        gameId:"uint256"
      },
      schema:{
        seeds:"uint256[]",
      }
    },
    SeedInited:{
      keySchema:{
        gameId:"uint256",
        user:"address"
      },
      schema:{
        seedInit:"bool"
      }
    },
    NumberOfUsers:{
      keySchema:{
        gameId:"uint256"
      },
      schema:{
        numOfUsers:"uint256"
      }
    },
    LimitOfGame:{
      keySchema:{
        gameId:"uint256"
      },
      schema:{
        numOfUsers:"uint256"
      }
    },
    AddressToUsername:{
      keySchema:{
        ownerAddress:"address",
        gameId:"uint256"
      },
      schema:{
        userName:"string"
      }
    },
    ResourceOwnable :{
      schema:{
        sourceType:"MineType",
        owner:"address",
        gameID:"uint256"
      },
    },
    ResourceInited:{
      keySchema:{
        gameID:"uint256"
      },
      schema:{
        isInited:"bool"
      }
    },
    GameMetaData:{
      keySchema:{
        gameID:"uint256"
      },
      schema:{
        state:"State",
        startBlock:"uint256",
        winner:"address",
        numberOfCastle:"uint256"
      }
    },
    ResourceOwn : {
      keySchema:{
        owner:"address",
        gameID:"uint256"
      },
      schema:{
        numOfFood:"uint256",
        numOfWood:"uint256",
        numOfGold:"uint256"
      }
    },
    LastCollectTime:{
      keySchema:{
        owner:"address",
        gameID:"uint256"
      },
      schema:{
        lastCollect:"uint256"
      }
    },
    ResourcesSold:{
      keySchema:{
        gameID:"uint256"
      },
      schema:{
        foodSold:"uint256",
        woodSold:"uint256",
        goldSold:"uint256",
      }
    },
    CreditOwn:{
      keySchema:{
        gameID:"uint256",
        owner:"address"
      },
      schema:{
        amount:"uint256"
      }
    },
    SoldierCreated:{
      keySchema:{
        gameID:"uint256",
      },
      schema:{
        numOfSwordsman:"uint256",
        numOfArcher:"uint256",
        numOfCavalry:"uint256"
      },
      dataStruct:false
    },
    ResourcePrices:{
      keySchema:{
        gameID:"uint256"
      },
      schema:{
        priceFood:"uint256",
        priceWood:"uint256",
        priceGold:"uint256"
      }
    },
    ArmyPrices:{
      keySchema:{
        gameID:"uint256"
      },
      schema:{
        priceSwordsman:"uint256",
        priceArcher:"uint256",
        priceCavalry:"uint256"
      }
    },
    DockOwnable: {
      schema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    FleetConfig: {
      schema: {
        numSmall: "uint32",
        numMedium: "uint32",
        numBig: "uint32",
        gameID: "uint256",
      },
      dataStruct: true,
    },
    FleetOwnable: {
      schema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    ClashResult:{
      schema:{
        winner:"address",
        loser:"address",
        isDraw:"bool",
        clashType:"ClashType"
      },
      ephemeral:true,
    }
  },
  
  enums: {
    MineType: ["Food","Wood","Gold"],
    State:["None","Waiting","Seed","Started","Completed"],
    ClashType:["Castle","Mine","Dock","Battle","NavalWar"],
    AttackerType:["Army","Fleet"],
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
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("ResourceOwnable")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("DockOwnable")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("FleetOwnable")],
    },
  ],
});
