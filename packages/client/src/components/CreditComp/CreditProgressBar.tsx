import "../../styles/globals.css";
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from "../../MUDContext";
import { useCredit } from '../../hooks/useCredit';

export const CreditProgressBar = () => {
    const { userWallet } = usePlayer();
    const { systemCalls } = useMUD();

    const credit: any = useCredit(1, userWallet!.address)?.value.amount;
    console.log(credit)

    return (
        <div className="credit-progress-bar">
            <div className="row">
                <div className="col-4 credit-progress-bar-col">
                    <>
                        💰: {credit ? parseFloat(credit).toString().slice(0, 8) : 0}
                    </>
                </div>
            </div>
        </div>
    )
}