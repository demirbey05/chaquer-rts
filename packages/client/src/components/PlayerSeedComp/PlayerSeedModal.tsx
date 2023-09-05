import "../../styles/globals.css";
import { Button, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { useSeedUsers } from '../../hooks/useSeedUsers';
import { useCountOfPlayerSeed } from '../../hooks/useCountOfPlayerSeed';
import { limitOfUser } from '../../utils/constants/constants';

export const PlayerSeedModal = () => {
    const { systemCalls } = useMUD()
    const [disable, setDisable] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const { userWallet, setPlayerSeed, playerSeed } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const seedEntered = useSeedUsers(1, userWallet);
    const playerSeedCount = useCountOfPlayerSeed(1);

    const handleInput = (e: any) => {
        if (e.target.value > 0 && e.target.value < 100) {
            setPlayerSeed(e.target.value)
            setDisable(false);
        }
        else {
            setDisable(true);
        }
    }

    const handleConfirmClick = async () => {
        if (playerSeed && !seedEntered) {
            setIsModalOpen(false)
            const tx = await systemCalls.commitSeed(1, playerSeed);
            if (tx == null) {
                setErrorMessage("An error occurred while trying to enter player seed.")
                setErrorTitle("Player Seed Error")
                setShowError(true)
                return
            }
        }
    }

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            {
                isModalOpen &&
                <div className="playerSeedModal">
                    <div className="playerSeedModal-header">
                        <h2>Player Seed Stage</h2>
                    </div>
                    <div className="playerSeedModal-body">
                        <input onChange={(e: any) => handleInput(e)}
                            type="number"
                            className="form-control dark-input bg-dark text-white"
                            id="usernameinput"
                            placeholder='Enter player seed between 1-100' />
                    </div>
                    <div className="playerSeedModal-footer">
                        <Button isDisabled={disable}
                            onClick={handleConfirmClick}
                            colorScheme='whatsapp'
                            border="solid"
                            textColor="dark">
                            Confirm Seed
                        </Button>
                    </div>
                </div>
            }
            {
                seedEntered &&
                <div className="waiting-for-players-message-container">
                    <span className="waiting-for-players-info-message">Waiting players to enter their player seed...</span>
                    <span className="waiting-for-players-info-message d-flex align-items-center">
                        Need {limitOfUser - playerSeedCount} player to initialize the resources.
                        <CircularProgress className='ms-4' value={((playerSeedCount) / Number(limitOfUser)) * 100} color='green.400' thickness='12px'>
                            <CircularProgressLabel>({playerSeedCount}/{limitOfUser})</CircularProgressLabel>
                        </CircularProgress>
                    </span>
                    <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                </div>
            }
        </div>
    )
}