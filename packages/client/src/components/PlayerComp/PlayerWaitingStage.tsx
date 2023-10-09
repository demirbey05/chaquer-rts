import { useCallback } from 'react';
import { useBeforeUnload } from "react-router-dom";
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
    const gameState = gameData ? gameData.state : null;
    const numberOfPlayer = gameData ? Number(gameData.numberOfPlayer) : 0;
    const limitOfPlayer = gameData ? Number(Number(gameData.limitOfPlayer)) : 0;

    useBeforeUnload(
        useCallback((e) => {
            const handleExit = async () => {
                await systemCalls.exitGame(gameID)
            }
            handleExit();
        }, [])
    );

    if (isCastleSettled) {
        return (
            <div id="overlay" className="waiting-for-players-fade-overlay">
                <div className="waiting-for-players-message-container">
                    {
                        (gameState && gameData.state === 1) &&
                        <>
                            <span className="waiting-for-players-info-message">
                                Waiting for the other players...
                                <CircularProgress
                                    className='ms-4'
                                    value={(numberOfPlayer / limitOfPlayer) * 100}
                                    color='green.400'
                                    thickness='12px'>
                                    <CircularProgressLabel>
                                        ({numberOfPlayer}/{limitOfPlayer})
                                    </CircularProgressLabel>
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