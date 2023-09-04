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

    const numberOfResource = useNumberOfResource(userWallet, 1);
    const isMineInited = useIsMineInitialized(1);

    return (
        <div className="mine-progress-bar">
            <div className="row">
                <div className="col-4 mine-progress-bar-col">
                    🌽: {numberOfResource ? Number(numberOfResource.numOfFood) : 100}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    🪓: {numberOfResource ? Number(numberOfResource.numOfWood) : 100}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    ⛏️: {numberOfResource ? Number(numberOfResource.numOfGold) : 100}
                </div>
            </div>
        </div>
    )
}