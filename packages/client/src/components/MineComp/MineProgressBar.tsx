import "../../styles/globals.css";
import { useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfResource } from '../../hooks/useNumberOfResource';
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';
import { useMUD } from "../../MUDContext";
import { useError } from "../../context/ErrorContext";

export const MineProgressBar = () => {
    const { userWallet, isPlayerLost } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD();

    const numberOfResource: any = useNumberOfResource(userWallet!.address, 1)?.value;
    const isMineInited: any = useIsMineInitialized(1)?.value.isInited;

    useEffect(() => {
        if (!isPlayerLost && isMineInited) {
            const interval = setInterval(async () => {
                const tx = await systemCalls.collectResource(1);
                if (tx == null) {
                    setErrorMessage("An error occured while collecting resources.")
                    setErrorTitle("Resource Collect Error")
                    setShowError(true)
                    return;
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlayerLost, isMineInited])

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