import '../../styles/globals.css';
import { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfUsers } from '../../hooks/useNumberOfUsers';
import { useMUD } from '../../MUDContext';

export const WaitingForPlayerWarning = () => {
    const connectedUserNumber = Number(useNumberOfUsers(1)?.value.numOfUsers);
    const limitOfUser = 2;
    const { setPlayerWaitingStage } = usePlayer();
    const { systemCalls } = useMUD()

    const [count, setCount] = useState(10);
    const [resourceInitStage, setResourceInitStage] = useState<boolean>();

    useEffect(() => {
        if (connectedUserNumber && (connectedUserNumber === 2)) {
            setResourceInitStage(true)
        }

        if (connectedUserNumber && (connectedUserNumber === 2) && !resourceInitStage && count !== 0) {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [connectedUserNumber]);

    useEffect(() => {
        if (count <= 0 && !resourceInitStage) {
            setPlayerWaitingStage(false);
        }
    }, [count])

    const InitResources = async () => {
        const tx = await systemCalls.resourceSystemInit(1);
        setResourceInitStage(false)
        if (tx == null) {
            console.log("During resource initialization error occured.")
            return
        }
    }

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                {connectedUserNumber && connectedUserNumber !== 2 &&
                    <>
                        <span className="waiting-for-players-info-message">Waiting for other players...</span>
                        <span className="waiting-for-players-info-message">{connectedUserNumber} players are ready...</span>
                        <span className="waiting-for-players-info-message">Need {limitOfUser - connectedUserNumber} player to start the game...</span>
                    </>
                }
                {
                    connectedUserNumber &&
                    connectedUserNumber === 2 &&
                    !resourceInitStage &&
                    <span className="waiting-for-players-info-message">Game is starting in {count} seconds.</span>
                }
                {resourceInitStage && <button onClick={() => InitResources()} className="waiting-for-players-info-message btn btn-outline-light">Initialize Resources</button>}
            </div>
        </div >
    )
}