import '../../styles/globals.css';
import { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const WaitingForPlayerWarning = () => {
    const [connectedUserNumber, setConnectedUserNumber] = useState<number>(2);
    const limitOfUser = 10;
    const { setPlayerWaitingStage } = usePlayer();

    const [count, setCount] = useState(10);

    useEffect(() => {
        if (connectedUserNumber === 10 && count !== 0) {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [connectedUserNumber]);

    useEffect(() => {
        if (count === 0) {
            setPlayerWaitingStage(false);
        }
    }, [count])

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                {connectedUserNumber !== 10 ?
                    <>
                        <span className="waiting-for-players-info-message">Waiting for other players...</span>
                        <span className="waiting-for-players-info-message">{connectedUserNumber} players are ready...</span>
                        <span className="waiting-for-players-info-message">Need {limitOfUser - connectedUserNumber} player to start the game...</span>
                    </> :
                    <span className="waiting-for-players-info-message">Game is starting in {count} seconds.</span>
                }
            </div>
        </div >
    )
}