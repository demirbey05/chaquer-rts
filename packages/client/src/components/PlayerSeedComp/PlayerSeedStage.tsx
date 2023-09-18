import { Progress } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useGameState } from "../../hooks/useGameState";
import { useSeedInited } from "../../hooks/IdentityHooks/useSeedInited";
import { usePlayer } from "../../context/PlayerContext";

export const PlayerSeedStage = () => {
    const { systemCalls } = useMUD()
    const { userWallet } = usePlayer();

    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const gameState = useGameState(1);
    const seedEntered = useSeedInited(1, userWallet);

    useEffect(() => {
        const sendSeed = async () => {
            if (gameState === 2 && !seedEntered) {
                var buf = new Uint8Array(1);
                crypto.getRandomValues(buf);

                const tx = await systemCalls.commitSeed(1, buf[0]);
                if (tx === null) {
                    setErrorMessage("An error occurred while trying to enter player seed.");
                    setErrorTitle("Player Seed Error");
                    setShowError(true);
                }
            }
        };

        sendSeed();

        const intervalId = setInterval(sendSeed, 10000);
        return () => {
            clearInterval(intervalId);
        };
    }, [gameState, seedEntered]);

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                <span className="waiting-for-players-info-message">Preparing resource seeds...</span>
                <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
            </div>
        </div>
    )
}