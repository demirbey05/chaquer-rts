import "../../styles/globals.css";
import { usePlayer } from '../../context/PlayerContext';
import { useCredit } from '../../hooks/EconomyHooks/useCredit';
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const CreditProgressBar = () => {
    const { userWallet } = usePlayer();
    const credit = useCredit(1, userWallet);

    return (
        <div className="credit-progress-bar">
            <div className="row">
                <div className="col-4 credit-progress-bar-col">
                    <>
                        💰: {credit ? getNumberFromBigInt(credit).slice(0, 12) : 0}
                    </>
                </div>
            </div>
        </div>
    )
}