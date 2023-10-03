import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useCredit } from '../../../hooks/EconomyHooks/useCredit';
import { getNumberFromBigInt } from "../../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const CreditCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const credit = useCredit(gameID, userWallet);
    return (
        <>
            💰: {credit ? getNumberFromBigInt(credit).slice(0, 12) : 0}
        </>
    )
}