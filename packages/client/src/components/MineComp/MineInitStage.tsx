import { useEffect } from 'react';
import { Progress } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';
import { useGame } from '../../context/GameContext';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();
    const { gameID } = useGame();

    const isMineInited = useIsMineInitialized(gameID);

    useEffect(() => {
        const initResource = async () => {
            if (!isMineInited) {
                await systemCalls.resourceSystemInit(gameID);
            }
        };

        const intervalId = setInterval(initResource, 5000);
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
