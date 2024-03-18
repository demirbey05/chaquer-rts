import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config/library";


export default mudConfig({
  tables: {
    ArmyConfig: {
      valueSchema: {
        numSwordsman: "uint32",
        numArcher: "uint32",
        numCavalry: "uint32",
        gameID: "uint256",
      },
      dataStruct: true,
    },
    ArmyOwnable: {
      valueSchema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    CastleOwnable: {
      valueSchema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    MapConfig: {
      keySchema: {
        gameID: "uint256",
      },
      valueSchema: {
        width: "uint32",
        height: "uint32",
        terrain: "bytes",
      },
      dataStruct: false,
    },
    Position: {
      valueSchema: {
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
      } ,valueSchema :{
        userValid:"bool"
      }
    },
    PlayerSeeds:{
      keySchema:{
        gameId:"uint256"
      },
      valueSchema:{
        seeds:"uint256[]",
      }
    },
    SeedInited:{
      keySchema:{
        gameId:"uint256",
        user:"address"
      },
      valueSchema:{
        seedInit:"bool"
      }
    },

    AddressToUsername:{
      keySchema:{
        ownerAddress:"address",
      },
      valueSchema:{
        userName:"string",      
      }
    },

    AddressToColorIndex:{
      keySchema:{
        ownerAddress:"address",
        gameID:"uint256"
      },
      valueSchema:{
        mirror:"uint256",
        colorIndex:"uint256",
        userName:"string"    
      }
    },
    ResourceOwnable :{
      valueSchema:{
        sourceType:"MineType",
        owner:"address",
        gameID:"uint256"
      },
    },
    GameMetaData:{
      keySchema:{
        gameID:"uint256"
      },
      valueSchema:{
        mirror:"uint256",
        state:"State",
        mapId:"uint8",
        startBlock:"uint256",
        winner:"address",
        numberOfCastle:"uint256",
        colorCursor:"uint256",
        numberOfPlayer:"uint256",
        limitOfPlayer:"uint256",
        isInited:"bool",
        name:"string",
      }
    },
    ResourceOwn : {
      keySchema:{
        owner:"address",
        gameID:"uint256"
      },
      valueSchema:{
        numOfFood:"uint256",
        numOfWood:"uint256",
        numOfGold:"uint256",
        lastCollect:"uint256"
      }
    },
    ResourcesSold:{
      keySchema:{
        gameID:"uint256"
      },
      valueSchema:{
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
      valueSchema:{
        amount:"uint256"
      }
    },
    SoldierCreated:{
      keySchema:{
        gameID:"uint256",
      },
      valueSchema:{
        numOfSwordsman:"uint256",
        numOfArcher:"uint256",
        numOfCavalry:"uint256"
      },
      dataStruct:false
    },
    DockOwnable: {
      valueSchema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    FleetConfig: {
      valueSchema: {
        numSmall: "uint32",
        numMedium: "uint32",
        numBig: "uint32",
        gameID: "uint256",
      },
      dataStruct: true,
    },
    FleetOwnable: {
      valueSchema: {
        owner: "address",
        gameID: "uint256",
      },
      dataStruct: false,
    },
    ClashResult:{
      valueSchema:{
        winner:"address",
        loser:"address",
        isDraw:"bool",
        clashType:"ClashType",
        gameID:"uint256",
      },
      offchainOnly:true,
    },
    ColorOwnable:{
      valueSchema:{
        colorIndex:"uint256",
        gameID:"uint256"
      }
    },
    ChatMessages:{
      valueSchema:{
        time:"uint256",
        gameID:"uint256",
        userName:"string",
        message:"string",
        
      },
      offchainOnly:true,
    },
    FleetCarry:{
      valueSchema:{
        carrierID:"bytes32",
        gameID:"uint256",
      }
    },
    LastMessageTime:{
      keySchema:{
        gameID:"uint256",
        user:"address"
      },valueSchema:{
        time:"uint256"
       }
    },
    LatestGameID:"uint256"

  },
  
  enums: {
    MineType: ["Food","Wood","Gold"],
    State:["None","Waiting","Started","Completed"],
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
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("FleetCarry")],
    },
  ],
});
