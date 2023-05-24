//SPDX-License-Identifier:MIT


pragma solidity ^0.8.0;

// Init System Errors
error InitSystem__AlreadyInitialized();
error InitSystem__MismatchedSize();
error InitSystem__NotEnoughDimension();

//Castle Settle System Errors
error CastleSettle__MapIsNotReady();
error CastleSettle__CoordinatesOutOfBound();
error CastleSettle__TileIsNotEmpty();
error CastleSettle__WrongTerrainType();
error CastleSettle__NoCastleRight();


//Army Settle System
error ArmySettle__CoordinatesOutOfBound();
error ArmySettle__TileIsNotEmpty();
error ArmySettle__NoArmyRight();
error ArmySettle__NoCastle();
error ArmySettle__TooFarToSettle();
error ArmySettle__TooManySoldier();
error ArmySettle__WrongTerrainType();

// Army Move System

error MoveArmy__NoAuthorized();
error MoveArmy__TooFar();
error MoveArmy__TileIsNotEmpty();
error MoveArmy__WrongTerrainType();