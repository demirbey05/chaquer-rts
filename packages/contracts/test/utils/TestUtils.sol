//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import {ArmyConfigData} from "../../src/codegen/Tables.sol";
import {Vm} from "forge-std/Vm.sol";

address constant HEVM_ADDRESS = address(uint160(uint256(keccak256("hevm cheat code"))));

library TestUtils {

    Vm internal constant vm = Vm(HEVM_ADDRESS);
    function getRandomUserAddress(bytes32 seed) pure internal returns (address payable user ){
        user = payable(address(uint160(uint256(seed))));
    }


    function initMap(IWorld world ,string memory path,uint32 width,uint32 height,uint256 gameID) internal {
        bytes memory map1 = bytes(vm.readFile(path));
        world.initMapData(gameID,width,height,map1);
    }
    function settleCastle(IWorld world,uint32 x, uint32 y, uint256 gameID,address user) internal returns (bytes32) {
        vm.startPrank(user);
        bytes32 entityID = world.settleCastle(x,y,gameID);
        vm.stopPrank();
        return entityID;
    }
    function settleArmy(IWorld world,uint32 x,
        uint32 y,
        uint32 numSwordsman,
        uint32 numArcher,
        uint32 numCavalry,
        address user,
        uint256 gameID) internal returns (bytes32) {
        
        vm.startPrank(user);
        bytes32 entityID = world.settleArmy(x,y,ArmyConfigData(numSwordsman,numArcher,numCavalry,gameID));
        vm.stopPrank();
        return entityID;
    }
    function moveArmy(IWorld world, bytes32 armyID,
        uint32 x,
        uint32 y,
        address user,
        uint256 gameID) internal {
        
        vm.startPrank(user);
        world.armyMove(armyID,x,y,gameID);
        vm.stopPrank();



        
    }
}