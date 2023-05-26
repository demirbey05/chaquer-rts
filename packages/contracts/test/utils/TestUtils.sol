//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import {ArmyOwnable,ArmyConfigData} from "../../src/codegen/Tables.sol";
import {Vm} from "forge-std/Vm.sol";
import { hasKey } from "@latticexyz/world/src/modules/keysintable/hasKey.sol";


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
    function attackArmy(IWorld world,bytes32 armyOne,bytes32 armyTwo,address user,uint256 gameID) internal returns (uint256 res){
        vm.startPrank(user);
        res = world.attackToArmy(armyOne,armyTwo,gameID);
        vm.stopPrank();
    }
    function isArmyExist(IWorld world,bytes32 armyID) internal returns(bool){
        address owner = ArmyOwnable.getOwner(world,armyID);

        return owner != address(0);

    }
    function attackCastle(IWorld world,bytes32 armyOne,bytes32 castleID,address user)internal returns (uint256){
        vm.startPrank(user);
        uint256 result = world.captureCastle(armyOne,castleID);
        vm.stopPrank();
        return result;
    }
}