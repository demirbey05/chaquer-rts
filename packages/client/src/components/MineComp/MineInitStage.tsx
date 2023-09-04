import { useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react'
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();
    const [count, setCount] = useState(3);

    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const isMineInited = useIsMineInitialized(1)

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
                    !isMineInited &&
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
