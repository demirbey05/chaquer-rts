//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

// Init System Errors
error InitSystem__AlreadyInitialized();
error InitSystem__MismatchedSize();
error InitSystem__NotEnoughDimension();
error InitSystem__NotInitialized();
error InitSystem__CapacityAlreadyInitialized();
error InitSystem__CapacityIsTooLow();

//Castle Settle System Errors
error CastleSettle__MapIsNotReady();
error CastleSettle__CoordinatesOutOfBound();
error CastleSettle__TileIsNotEmpty();
error CastleSettle__WrongTerrainType();
error CastleSettle__NoCastleRight();
error CastleSettle__NotPlayer();

//Army Settle System
error ArmySettle__CoordinatesOutOfBound();
error ArmySettle__TileIsNotEmpty();
error ArmySettle__NoArmyRight();
error ArmySettle__NoCastle();
error ArmySettle__TooFarToSettle();
error ArmySettle__TooManySoldier();
error ArmySettle__WrongTerrainType();
error ArmySettle__UnsufficientBalance();

// Army Move System

error MoveArmy__NoAuthorized();
error MoveArmy__TooFar();
error MoveArmy__TileIsNotEmpty();
error MoveArmy__WrongTerrainType();

//Attack System Errors
error AttackSystem__ArmyNotBelongYou();
error AttackSystem__TooAwayToAttack();
error AttackSystem__NoArmy();
error AttackSystem__NoFriendFire();
error AttackSystem__WrongGameID();

//Capture System Errors
error CaptureSystem__TooFarToAttack();
error CaptureSystem__NoAuthorization();
error CaptureSystem__FriendFireNotAllowed();
error CaptureSystem__NonMatchedGameID();

// MineInitSystem Errors
error MineSystem__NoAuthorized();
error MineSystem__GameIsNotFull();
error MineSystem__NotAllUsersSubmitSeed();
error MineSystem__ResourceInitialized();
error MineSystem__RandomizationError();
error MineSystem__NoCastleOfUsers();

// Identity System Errors
error IdentitySystem__AlreadyJoined();
error IdentitySystem__GameIsFull();
error IdentitySystem__InvalidUserName();
error IdentitySystem__GameDoesNotExist();
error IdentitySystem__WrongState();

// MineCapture System Errors

error MineCapture__FriendFireNotAllowed();
error MineCapture__NoAuthorization();
error MineCapture__TooFarToAttack();
error MineCapture__NonMatchedGameID();

// Economy System Errors

error EconomySystem__DifferenceIsLess();
error EconomySystem__InsufficientSource();
