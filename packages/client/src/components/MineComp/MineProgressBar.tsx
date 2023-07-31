import "../../styles/globals.css";
import { useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfResource } from '../../hooks/useNumberOfResource';
import { useMUD } from "../../MUDContext";

export const MineProgressBar = () => {
    const { userWallet } = usePlayer()
    const { systemCalls } = useMUD();
    const numberOfResource = useNumberOfResource(userWallet!.address, 1)?.value;

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
        <div className="mine-progress-bar">
            <div className="row">
                <div className="col-4 mine-progress-bar-col">
                    🌽: {numberOfResource ? Number(numberOfResource.numOfFood) : 1000}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    🪓: {numberOfResource ? Number(numberOfResource.numOfWood) : 1000}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    ⛏️: {numberOfResource ? Number(numberOfResource.numOfGold) : 1000}
                </div>
            </div>
        </div>
    )
}