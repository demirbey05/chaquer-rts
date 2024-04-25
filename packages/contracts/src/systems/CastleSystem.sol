//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { CastleHP, CastleOwnable,CreditOwn } from "../codegen/index.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibUtils } from "../libraries/Utils.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

error OwnerSenderMismatch();
error CastleAlreadyFullHP();
error InsufficientCredit();

contract CastleSystem is System {


    function repairCastle(bytes32 castleID, uint256 amount) public {

        address owner = CastleOwnable.getOwner(castleID);
        address sender = _msgSender();
        uint256 gameID = CastleOwnable.getGameID(castleID);
        uint256 hp = CastleHP.getCastleHP(castleID);

        if (owner != sender) {
            revert OwnerSenderMismatch();
        }
        if (hp == 100) {
            revert CastleAlreadyFullHP();
        }
        if (amount > 100 - hp) {
            amount = 100 - hp;
        }

        uint256 credit = CreditOwn.getAmount( gameID,owner);

        if (credit < amount * 100 *1e18) {
            revert InsufficientCredit();
        }
        CreditOwn.setAmount(gameID,owner,credit - amount * 100 * 1e18);
        CastleHP.setCastleHP(castleID, hp + amount);
    }
}