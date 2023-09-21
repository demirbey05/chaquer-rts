import { useEffect } from 'react';
import { Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useNumberOfUsers } from '../../hooks/IdentityHooks/useNumberOfUsers';
import { limitOfUser } from '../../utils/constants/constants';
import { useGameState } from '../../hooks/useGameState';
import { GameTips } from '../TipsComp/GameTips';
import { useMUD } from '../../context/MUDContext';
import { useCastle } from '../../context/CastleContext';

export const PlayerWaitingStage = () => {
    const { systemCalls } = useMUD();
    const numberOfUser = useNumberOfUsers(1);
    const gameState = useGameState(1);
    const { isCastleSettled } = useCastle();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            systemCalls.exitGame(1)
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
                        (gameState && gameState === 1) &&
                        <>
                            <span className="waiting-for-players-info-message">
                                Waiting for the other players...
                                <CircularProgress className='ms-4' value={(Number(numberOfUser) / Number(limitOfUser)) * 100} color='green.400' thickness='12px'>
                                    <CircularProgressLabel>({numberOfUser}/{limitOfUser})</CircularProgressLabel>
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