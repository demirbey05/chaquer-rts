import "../../styles/globals.css";
import { usePlayer } from '../../context/PlayerContext';
import { useCredit } from '../../hooks/useCredit';
import { getNumberFromBigInt } from "../../utils/getNumberFromBigInt";

export const CreditProgressBar = () => {
    const { userWallet } = usePlayer();
    const credit: any = useCredit(1, userWallet!.address)?.value.amount;

    return (
        <div className="credit-progress-bar">
            <div className="row">
                <div className="col-4 credit-progress-bar-col">
                    <>
                        💰: {credit ? getNumberFromBigInt(credit).slice(0, 14) : 0}
                    </>
                </div>
            </div>
        </div>
    )
}