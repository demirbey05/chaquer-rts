import '../../styles/globals.css';
import { Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfUsers } from '../../hooks/useNumberOfUsers';
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';
import { useCountOfPlayerSeed } from '../../hooks/useCountOfPlayerSeed';
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { limitOfUser } from '../../utils/constants/constants';

export const PlayerWaitingStage = () => {
    const connectedUserNumber = useNumberOfUsers(1);
    const isMineInited = useIsMineInitialized(1)
    const playerSeedCount = useCountOfPlayerSeed(1);

    const { setPlayerWaitingStage } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD()

    const [count, setCount] = useState(3);

    useEffect(() => {
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
                    (playerSeedCount !== limitOfUser) &&
                    <>
                        <span className="waiting-for-players-info-message">Waiting for other players...</span>
                        <span className="waiting-for-players-info-message d-flex align-items-center">
                            {
                                (
                                    connectedUserNumber !== limitOfUser ?
                                        `Need ${limitOfUser - connectedUserNumber} player to start the game` :
                                        "All players are connected, please initalize the resources to start the game"
                                )
                            }
                            <CircularProgress className='ms-4' value={(Number(connectedUserNumber) / Number(limitOfUser)) * 100} color='green.400' thickness='12px'>
                                <CircularProgressLabel>({connectedUserNumber}/{limitOfUser})</CircularProgressLabel>
                            </CircularProgress>
                        </span>
                        <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                    </>
                }
                {
                    !isMineInited && (playerSeedCount === limitOfUser) &&
                    <button onClick={() => InitResources()}
                        className="waiting-for-players-info-message btn btn-outline-light">
                        Initialize Resources
                    </button>
                }
                {
                    isMineInited &&
                    <span className="waiting-for-players-info-message">
                        Game is starting in {count} seconds.
                        <Progress size='sm' colorScheme={"whatsapp"} value={count * 34} />
                    </span>
                }
            </div>
        </div >
    )
}