import { usePlayer } from '../../../context/PlayerContext';
import { useCredit } from '../../../hooks/EconomyHooks/useCredit';
import { getNumberFromBigInt } from "../../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const CreditCount = () => {
    const { userWallet } = usePlayer();
    const credit = useCredit(1, userWallet);
    return (
        <>
            💰: {credit ? getNumberFromBigInt(credit).slice(0, 12) : 0}
        </>
    )
}