import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useCastle } from '../../context/CastleContext';
import { useGame } from '../../context/GameContext';
import { GameTips } from '../TipsComp/GameTips';
import { useGameData } from '../../hooks/useGameData';

export const PlayerWaitingStage = () => {
    const { gameID } = useGame();
    const { isCastleSettled } = useCastle();

    const gameData = useGameData(gameID)
    const numberOfPlayer = gameData ? Number(gameData.numberOfPlayer) : 0;
    const limitOfPlayer = gameData ? Number(Number(gameData.limitOfPlayer)) : 0;

    if (isCastleSettled) {
        return (
            <div id="overlay" className="waiting-for-players-fade-overlay">
                <div className="waiting-for-players-message-container">
                    <span className="waiting-for-players-info-message">
                        {
                            gameData && numberOfPlayer !== limitOfPlayer && "Waiting for other players..."
                        }
                        {
                            gameData && numberOfPlayer === limitOfPlayer && "Waiting for castle settlements..."
                        }
                        <CircularProgress
                            className='ms-4'
                            max={limitOfPlayer}
                            value={numberOfPlayer}
                            thickness='16px'>
                            <CircularProgressLabel>
                                {numberOfPlayer}/{limitOfPlayer}
                            </CircularProgressLabel>
                        </CircularProgress>
                    </span>
                    <GameTips />
                </div>
            </div>
        )
    } else {
        return null;
    }
}