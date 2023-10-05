import { Progress } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useSeedInited } from "../../hooks/IdentityHooks/useSeedInited";
import { usePlayer } from "../../context/PlayerContext";
import { useGame } from '../../context/GameContext';
import { useGameData } from '../../hooks/useGameData';

export const PlayerSeedStage = () => {
    const { systemCalls } = useMUD()
    const { userWallet } = usePlayer();
    const { gameID } = useGame();

    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const gameData = useGameData(gameID)
    console.log(gameData)
    const seedEntered = useSeedInited(gameID, userWallet);
    console.log(seedEntered)
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

                const tx = await systemCalls.commitSeed(gameID, buf[0]);
                if (tx === null) {
                    setErrorMessage("An error occurred while trying to enter player seed.");
                    setErrorTitle("Player Seed Error");
                    setShowError(true);
                }
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
                <span className="waiting-for-players-info-message">Preparing resource seeds...</span>
                <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
            </div>
        </div>
    )
}