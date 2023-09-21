import { useEffect } from 'react';
import { Progress } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';
import { useSyncProgress } from '../../hooks/useSyncProgress';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const isMineInited = useIsMineInitialized(1);

    useEffect(() => {
        const initResource = async () => {
            if (!isMineInited) {
                const tx = await systemCalls.resourceSystemInit(1);
            }
        };

        initResource();

        const intervalId = setInterval(initResource, 10000);
        return () => {
            clearInterval(intervalId);
        };
    }, [isMineInited]);

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                <span className="waiting-for-players-info-message">Deploying resources...</span>
                <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
            </div>
        </div>
    )
}
