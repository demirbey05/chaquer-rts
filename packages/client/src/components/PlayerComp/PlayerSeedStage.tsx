import { useEffect } from 'react'
import { Progress } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from '../../context/GameContext';
import { useGameData } from '../../hooks/useGameData';
import { useSeedInited } from "../../hooks/IdentityHooks/useSeedInited";

export const PlayerSeedStage = () => {
    const { systemCalls } = useMUD()
    const { userWallet } = usePlayer();
    const { gameID } = useGame();

    const gameData = useGameData(gameID)
    const seedEntered = useSeedInited(gameID, userWallet);

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

    useEffect(() => {
        const sendSeed = async () => {
            if (gameData && gameData.state === 2 && !seedEntered) {
                var buf = new Uint8Array(1);
                crypto.getRandomValues(buf);
                await systemCalls.commitSeed(gameID, buf[0]);
            }
        };

        const intervalId = setInterval(sendSeed, 5000);
        return () => {
            clearInterval(intervalId);
        };
    }, [gameData, seedEntered]);

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                <span className="waiting-for-players-info-message">Deploying resources...</span>
                <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
            </div>
        </div>
    )
}