import '../../styles/globals.css';
import { Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useNumberOfUsers } from '../../hooks/IdentityHooks/useNumberOfUsers';
import { limitOfUser } from '../../utils/constants/constants';
import { useGameState } from '../../hooks/useGameState';

export const PlayerWaitingStage = () => {
    const numberOfUser = useNumberOfUsers(1);
    const gameState = useGameState(1);

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                {
                    (gameState && gameState === 1) &&
                    <>
                        <span className="waiting-for-players-info-message d-flex align-items-center">
                            Waiting for the other players...
                            <CircularProgress className='ms-4' value={(Number(numberOfUser) / Number(limitOfUser)) * 100} color='green.400' thickness='12px'>
                                <CircularProgressLabel>({numberOfUser}/{limitOfUser})</CircularProgressLabel>
                            </CircularProgress>
                        </span>
                        <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                    </>
                }
            </div>
        </div>
    )
}