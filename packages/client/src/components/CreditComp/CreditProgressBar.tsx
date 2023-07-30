import "../../styles/globals.css";
import { useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from "../../MUDContext";
import { useCredit } from '../../hooks/useCredit';

export const CreditProgressBar = () => {
    const { userWallet } = usePlayer()
    const { systemCalls } = useMUD();
    const credit: any = useCredit(1, userWallet!.address)?.value.amount; // Buradaki type bozuk

    useEffect(() => {
        const interval = setInterval(async () => {
            const tx = await systemCalls.collectResource(1);
            if (tx == null) {
                console.log("Error occurred during resource collecting.");
                return;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="credit-progress-bar">
            <div className="row">
                <div className="col-4 credit-progress-bar-col">
                    <>
                        💰: {credit ? Number(credit).toString().slice(0, 8) : 0}
                    </>
                </div>
            </div>
        </div>
    )
}