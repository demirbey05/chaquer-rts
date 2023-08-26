import '../../styles/globals.css';
import { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfUsers } from '../../hooks/useNumberOfUsers';
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';
import { useMUD } from '../../MUDContext';
<<<<<<< HEAD
import { useError } from '../../context/ErrorContext';
=======
import { limitOfUser } from '../../constants';
>>>>>>> a48338496a481df06b342f3c67948c75f8e6d5e9

export const PlayerWaitingStage = () => {
    const connectedUserNumber = Number(useNumberOfUsers(1)?.value.numOfUsers);
    const isMineInited = useIsMineInitialized(1)?.value.isInited;
    const checkMineAlreadyInited = localStorage.getItem("mineinit")

    const { setPlayerWaitingStage } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD()

    const [count, setCount] = useState(5);
    const [resourceInitStage, setResourceInitStage] = useState<boolean>();

    // Bring initializade button when all players connected
    useEffect(() => {
        if (connectedUserNumber && (connectedUserNumber === limitOfUser)) {
            setResourceInitStage(true)
        }
    }, [connectedUserNumber]);

    // Set counter from 10
    useEffect(() => {
        if (localStorage.getItem('mineinit')) {
            setPlayerWaitingStage(false)
        }

        setResourceInitStage(false)

        if (isMineInited && count > 0) {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isMineInited])

    // Check playerWaitingStage state
    useEffect(() => {
        if (count === 0 && isMineInited) {
            setPlayerWaitingStage(false);
            localStorage.setItem('mineinit', "true");
        }
    }, [count, isMineInited])

    const InitResources = async () => {
        if (!isMineInited) {
            const tx = await systemCalls.resourceSystemInit(1);
            if (tx == null) {
                setErrorMessage("An error occurred while initializing the mines.")
                setErrorTitle("Mine Initialize Error")
                setShowError(true)
                return
            }
        }
    }

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                {
                    connectedUserNumber && connectedUserNumber !== limitOfUser &&
                    <>
                        <span className="waiting-for-players-info-message">Waiting for other players...</span>
                        <span className="waiting-for-players-info-message">Need {limitOfUser - connectedUserNumber} player to start the game. ({connectedUserNumber}/{limitOfUser})</span>
                    </>
                }
                {isMineInited && checkMineAlreadyInited === null && <span className="waiting-for-players-info-message">Game is starting in {count} seconds.</span>}
                {!isMineInited && resourceInitStage && <button onClick={() => InitResources()} className="waiting-for-players-info-message btn btn-outline-light">Initialize Resources</button>}
            </div>
        </div >
    )
}