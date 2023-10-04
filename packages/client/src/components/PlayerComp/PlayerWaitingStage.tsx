import { useEffect } from 'react';
import { Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useCastle } from '../../context/CastleContext';
import { useGame } from '../../context/GameContext';
import { GameTips } from '../TipsComp/GameTips';
import { useGameData } from '../../hooks/useGameData';

export const PlayerWaitingStage = () => {
    const { systemCalls } = useMUD();
    const { gameID } = useGame();
    const { isCastleSettled } = useCastle();

    const gameData = useGameData(gameID)

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            systemCalls.exitGame(gameID)
            event.preventDefault();
            event.returnValue = 'If you leave the page, you will leave the game.';
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return (() => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        })
    }, [])

    if (isCastleSettled) {
        return (
            <div id="overlay" className="waiting-for-players-fade-overlay">
                <div className="waiting-for-players-message-container">
                    {
                        (gameData.state && gameData.state === 1) &&
                        <>
                            <span className="waiting-for-players-info-message">
                                Waiting for the other players...
                                <CircularProgress className='ms-4' value={(Number(gameData.numberOfPlayer) / Number(gameData.limitOfPlayer)) * 100} color='green.400' thickness='12px'>
                                    <CircularProgressLabel>({Number(gameData.numberOfPlayer)}/{Number(gameData.limitOfPlayer)})</CircularProgressLabel>
                                </CircularProgress>
                            </span>
                            <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                        </>
                    }
                    <GameTips />
                </div>
            </div>
        )
    } else {
        return null;
    }
}