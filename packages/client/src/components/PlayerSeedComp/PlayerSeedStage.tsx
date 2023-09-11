import "../../styles/globals.css";
import { Progress } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { useGameState } from "../../hooks/useGameState";

export const PlayerSeedStage = () => {
    const { systemCalls } = useMUD()

    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const gameState = useGameState(1);

    useEffect(() => {
        const sendSeed = async () => {
            if (gameState === 2) {
                var buf = new Uint8Array(1);
                crypto.getRandomValues(buf);

                const tx = await systemCalls.commitSeed(1, buf[0]);
                if (tx === null) {
                    setErrorMessage("An error occurred while trying to enter player seed.");
                    setErrorTitle("Player Seed Error");
                    setShowError(true);
                    return;
                }
            }
        };

        sendSeed();
    }, [gameState]);


    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                <span className="waiting-for-players-info-message">Preparing resource seeds...</span>
                <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
            </div>
        </div>
    )
}