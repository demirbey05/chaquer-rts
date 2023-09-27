import { useEffect } from 'react';
import { Progress } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();

    const isMineInited = useIsMineInitialized(1);

    useEffect(() => {
        const initResource = async () => {
            if (!isMineInited) {
                await systemCalls.resourceSystemInit(1);
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
